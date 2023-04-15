using AutoMapper;
using Contracts.OrderDTOs;
using Domain.AppSettings;
using Domain.Exceptions;
using Domain.Models;
using Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Services.Abstractions;
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
        public OrderService(IOptions<AppSettings> settings, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _settings = settings;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
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
            order.DeliveryTime = order.OrderTime.AddMinutes(10);
            order.IsCanceled = false;

            await _unitOfWork.Orders.Add(order);
            await _unitOfWork.Save();
            return _mapper.Map<DisplayOrderDTO>(order);
        }
    }
}
