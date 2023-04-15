using AutoMapper;
using Contracts.Common;
using Contracts.OrderDTOs;
using Contracts.ProductDTOs;
using Domain.AppSettings;
using Domain.Exceptions;
using Domain.Models;
using Domain.Random;
using Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Services.Abstractions;
using Services.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IOptions<AppSettings> _settings;
        private readonly IRandomService _randomService;
        public OrderService(IOptions<AppSettings> settings, IUnitOfWork unitOfWork, IMapper mapper, IRandomService randomService)
        {
            _settings = settings;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _randomService = randomService;
        }

        public async Task<DisplayOrderDTO> GetById(Guid id)
        {
            Order order = await _unitOfWork.Orders.GetDetailed(id);
            if(order == null)
            {
                throw new NotFoundException("Order with id " + id + " does not exist");
            }

            return _mapper.Map<DisplayOrderDTO>(order);
        }

        public async Task<DisplayOrderDTO> CreateOrder(string buyerUsername, CreateOrderDTO createOrderDTO)
        {
            createOrderDTO.Comment ??= "";

            if(String.IsNullOrWhiteSpace(createOrderDTO.DeliveryAddress)) 
            {
                throw new BadRequestException("Delivery address cannot be empty");
            }

            if(createOrderDTO.Amount <= 0)
            {
                throw new BadRequestException("Amount must be > 0");
            }

            User buyer = await _unitOfWork.Users.Find(createOrderDTO.BuyerId);
            if(buyer == null) 
            {
                throw new BadRequestException("Buyer with id " + createOrderDTO.BuyerId + " does not exist");
            }

            if(!String.Equals(buyer.Username, buyerUsername))
            {
                throw new BadRequestException("You can only make orders for yourself");
            }

            Product product = await _unitOfWork.Products.Find(createOrderDTO.ProductId);
            if(product == null || product.IsDeleted)
            {
                throw new BadRequestException("Product with id " + createOrderDTO.ProductId + " does not exist");
            }

            if(product.Amount < createOrderDTO.Amount)
            {
                throw new BadRequestException("There are no " + createOrderDTO.Amount + " products with name " + product.Name + " remaining, " + product.Amount + " left");
            }

            Order order = _mapper.Map<Order>(createOrderDTO);
            order.Buyer = buyer;
            order.Product = product;
            order.Price = order.Amount * order.Product.Price + _settings.Value.DeliveryFee;
            product.Amount -= order.Amount;
            order.OrderTime = DateTime.Now;
            order.DeliveryTime = order.OrderTime.AddMinutes(_randomService.GetRandomNumberInRange(_settings.Value.MinDeliveryTime, _settings.Value.MaxDeliveryTime));
            order.IsCanceled = false;

            await _unitOfWork.Orders.Add(order);
            await _unitOfWork.Save();
            return _mapper.Map<DisplayOrderDTO>(order);
        }

        public async Task<DisplayOrderDTO> CancelOrder(string buyerUsername, Guid id)
        {
            Order order = await _unitOfWork.Orders.GetDetailed(id);
            if(order == null) 
            {
                throw new NotFoundException("Order with id " + id + " does not exist");
            }

            if(!String.Equals(order.Buyer.Username, buyerUsername))
            {
                throw new BadRequestException("You can only cancel your orders");
            }

            if(order.IsCanceled)
            {
                throw new BadRequestException("Order with id " + id + " has already been canceled");
            }

            if(order.OrderTime.AddMinutes(_settings.Value.CancelTime) < DateTime.Now)
            {
                throw new BadRequestException("It is too late to cancel order with id " + id);
            }

            Product product = await _unitOfWork.Products.Find(order.ProductId);
            order.IsCanceled = true;
            product.Amount += order.Amount;
            await _unitOfWork.Save();

            return _mapper.Map<DisplayOrderDTO>(order);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllNonDeliveredByBuyer(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetNonDeliveredDetailedByBuyer(id);
            return PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.OrdersPageSize, _mapper);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllDeliveredByBuyer(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetDeliveredDetailedByBuyer(id);
            return PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.OrdersPageSize, _mapper);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllNonDeliveredBySeller(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetNonDeliveredDetailedBySeller(id);
            return PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.OrdersPageSize, _mapper);
        }

        public async Task<PagedListDTO<DisplayOrderDTO>> GetAllDeliveredOrCanceledBySeller(Guid id, int page)
        {
            IEnumerable<Order> orders = await _unitOfWork.Orders.GetDeliveredOrCanceledDetailedBySeller(id);
            return PaginationHelper<Order, DisplayOrderDTO>.CreatePagedListDTO(orders, page, _settings.Value.OrdersPageSize, _mapper);
        }
    }
}
