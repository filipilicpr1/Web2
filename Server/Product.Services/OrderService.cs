using AutoMapper;
using Contracts.Common;
using Contracts.OrderDTOs;
using Contracts.ProductDTOs;
using Domain.AppSettings;
using Domain.Exceptions;
using Domain.Models;
using Domain.Utilities;
using Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Services.Abstractions;
using Services.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.UserDTOs;
using Dapr.Client;
using Google.Api;

namespace Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IOptions<AppSettings> _settings;
        private readonly IRandomUtility _randomUtility;
        private readonly DaprClient _daprClient;
        public OrderService(IOptions<AppSettings> settings, IUnitOfWork unitOfWork, IMapper mapper, IRandomUtility randomUtility, DaprClient daprClient)
        {
            _settings = settings;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _randomUtility = randomUtility;
            _daprClient = daprClient;
        }

        public async Task<DisplayOrderDTO> GetById(Guid id)
        {
            Order order = await _unitOfWork.Orders.GetDetailed(id);
            if(order == null)
            {
                throw new NotFoundException("Order with id " + id + " does not exist");
            }

            RestrictedDisplayUserDTO buyer = null;
            try
            {
                buyer = await _daprClient.InvokeMethodAsync<RestrictedDisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + order.BuyerId);
            }
            catch
            {
                throw new BadRequestException("Error getting buyer with id " + order.BuyerId);
            }

            if (buyer == null)
            {
                throw new BadRequestException("Buyer with id " + order.BuyerId + " does not exist");
            }

            DisplayOrderDTO displayOrderDTO = _mapper.Map<DisplayOrderDTO>(order);
            displayOrderDTO.Buyer = buyer;

            for(int i = 0; i < order.OrderProducts.Count; i++)
            {
                displayOrderDTO.OrderProducts[i].Seller = await _daprClient.InvokeMethodAsync<RestrictedDisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + order.OrderProducts[i].Product.SellerId);
            }
            return displayOrderDTO;
        }

        public async Task<DisplayOrderDTO> CreateOrder(string buyerUsername, CreateOrderDTO createOrderDTO)
        {
            createOrderDTO.Comment ??= "";

            if(String.IsNullOrWhiteSpace(createOrderDTO.DeliveryAddress)) 
            {
                throw new BadRequestException("Delivery address cannot be empty");
            }

            DisplayUserDTO buyer = null;
            try
            {
                buyer = await _daprClient.InvokeMethodAsync<DisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + createOrderDTO.BuyerId);
            }
            catch
            {
                throw new BadRequestException("Error getting buyer with id " + createOrderDTO.BuyerId);
            }

            if (buyer == null)
            {
                throw new BadRequestException("Buyer with id " + createOrderDTO.BuyerId + " does not exist");
            }

            if (!String.Equals(buyer.Username, buyerUsername))
            {
                throw new BadRequestException("You can only make orders for yourself");
            }

            if (createOrderDTO.OrderProducts == null || createOrderDTO.OrderProducts.Count() == 0) 
            {
                throw new BadRequestException("Order must have at least 1 product");
            }

            Order order = _mapper.Map<Order>(createOrderDTO);
            order.IsCanceled = false;
            await _unitOfWork.Orders.Add(order);

            double price = 0;
            List<Guid> sellerIds = new List<Guid>();
            foreach (CreateOrderProductDTO createOrderProductDTO in createOrderDTO.OrderProducts)
            {
                Domain.Models.Product product = await _unitOfWork.Products.Find(createOrderProductDTO.ProductId);

                if(product == null || product.IsDeleted) 
                {
                    throw new BadRequestException("Id " + createOrderProductDTO.ProductId + " is not a valid product id");
                }

                if(product.Amount < createOrderProductDTO.Amount)
                {
                    throw new BadRequestException("There are not " + createOrderProductDTO.Amount + " products with id " + product.Id + ", " + product.Amount + " remaining");
                }

                OrderProduct orderProduct = new OrderProduct()
                {
                    ProductId = createOrderProductDTO.ProductId,
                    OrderId =  order.Id,
                    Amount = createOrderProductDTO.Amount,
                    Price = product.Price
                };

                await _unitOfWork.OrderProducts.Add(orderProduct);
                product.Amount -= createOrderProductDTO.Amount;
                price += product.Price * orderProduct.Amount;
                if(sellerIds.Contains(product.SellerId))
                {
                    continue;
                }
                sellerIds.Add(product.SellerId);
            }

            order.OrderTime = DateTime.Now;
            order.DeliveryTime = order.OrderTime.AddMinutes(_randomUtility.GetRandomNumberInRange(_settings.Value.MinDeliveryTime, _settings.Value.MaxDeliveryTime));
            order.Price = price + _settings.Value.DeliveryFee * sellerIds.Count;

            await _unitOfWork.Save();
            return _mapper.Map<DisplayOrderDTO>(await _unitOfWork.Orders.GetDetailed(order.Id));
        }

        public async Task<DisplayOrderDTO> CancelOrder(string buyerUsername, Guid id)
        {
            Order order = await _unitOfWork.Orders.GetDetailed(id);
            if(order == null) 
            {
                throw new NotFoundException("Order with id " + id + " does not exist");
            }

            DisplayUserDTO buyer = null;
            try
            {
                buyer = await _daprClient.InvokeMethodAsync<DisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + order.BuyerId);
            }
            catch
            {
                throw new BadRequestException("Error getting buyer with id " + order.BuyerId);
            }

            if (buyer == null)
            {
                throw new BadRequestException("Buyer with id " + order.BuyerId + " does not exist");
            }

            if (!String.Equals(buyer.Username, buyerUsername))
            {
                throw new BadRequestException("You can only cancel your orders");
            }

            if (order.IsCanceled)
            {
                throw new BadRequestException("Order with id " + id + " has already been canceled");
            }

            if(order.OrderTime.AddMinutes(_settings.Value.CancelTime) < DateTime.Now)
            {
                throw new BadRequestException("It is too late to cancel order with id " + id);
            }

            order.IsCanceled = true;
            foreach(OrderProduct orderProduct in order.OrderProducts)
            {
                orderProduct.Product.Amount += orderProduct.Amount;
            }
            await _unitOfWork.Save();

            return _mapper.Map<DisplayOrderDTO>(order);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllNonDeliveredByBuyer(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetNonDeliveredDetailedByBuyer(id);
            PagedListDTO<DisplayOrderDTO> pagedList =  PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.BuyerOrdersPageSize, _mapper);
            return await GetBuyerAndSellers(pagedList, orders);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllDeliveredByBuyer(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetDeliveredDetailedByBuyer(id);
            PagedListDTO<DisplayOrderDTO> pagedList = PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.BuyerOrdersPageSize, _mapper);
            return await GetBuyerAndSellers(pagedList, orders);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllNonDeliveredBySeller(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetNonDeliveredDetailedBySeller(id);
            PagedListDTO<DisplayOrderDTO> pagedList = PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.OrdersPageSize, _mapper);
            return await GetBuyerAndSellers(pagedList, orders);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllDeliveredOrCanceledBySeller(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetDeliveredOrCanceledDetailedBySeller(id);
            PagedListDTO<DisplayOrderDTO> pagedList = PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.OrdersPageSize, _mapper);
            return await GetBuyerAndSellers(pagedList, orders);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllDetailed(int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetAllDetailed();
            PagedListDTO<DisplayOrderDTO> pagedList = PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.OrdersPageSize, _mapper);
            return await GetBuyerAndSellers(pagedList, orders);
        }

        private async Task<PagedListDTO<DisplayOrderDTO>> GetBuyerAndSellers(PagedListDTO<DisplayOrderDTO> pagedList, IEnumerable<Order> orders)
        {
            var ordersList = orders.ToList();
            foreach (var item in pagedList.Items)
            {
                item.Buyer = await _daprClient.InvokeMethodAsync<RestrictedDisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + ordersList.Find(order => order.Id == item.Id).BuyerId);
                foreach (var product in item.OrderProducts)
                {
                    product.Seller = await _daprClient.InvokeMethodAsync<RestrictedDisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + ordersList.Find(order => order.Id == item.Id).OrderProducts.Find(op => op.ProductId == product.Id).Product.SellerId);
                }
            }
            return pagedList;
        }
    }
}
