using AutoMapper;
using Contracts.OrderDTOs;
using Contracts.UserDTOs;
using Domain.Enums;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mapping
{
    public class OrderMappingProfile : Profile
    {
        public OrderMappingProfile()
        {
            CreateMap<Order, CreateOrderDTO>().ReverseMap();
            CreateMap<Order, DisplayOrderDTO>().ForMember(dest => dest.Status, opt => opt.MapFrom(src => GetOrderStatus(src))).ReverseMap();
        }

        private string GetOrderStatus(Order order)
        {
            return order.IsCanceled ? OrderStatuses.Canceled.ToString() 
                                    : order.DeliveryTime > DateTime.Now ? OrderStatuses.InProgress.ToString()
                                                                        : OrderStatuses.Delivered.ToString();
        }
    }
}
