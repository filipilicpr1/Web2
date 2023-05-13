using AutoMapper;
using Contracts.OrderDTOs;
using Contracts.ProductDTOs;
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
        public OrderMappingProfile(string defaultImagePath, int cancelTime)
        {
            CreateMap<Order, CreateOrderDTO>().ReverseMap();
            CreateMap<Order, DisplayOrderDTO>().ForMember(dest => dest.Status, opt => opt.MapFrom(src => GetOrderStatus(src)))
                                               .ForMember(dest => dest.CanCancel, opt => opt.MapFrom(src => src.OrderTime.AddMinutes(cancelTime) > DateTime.Now))
                                               .ReverseMap();
            CreateMap<CreateOrderDTO, Order>().ForMember(dest => dest.OrderProducts, opt => opt.Ignore());
            CreateMap<OrderProduct, DisplayProductDTO>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Product.Id))
                                                        .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Product.Name))
                                                        .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product.Description))
                                                        .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                                                        .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
                                                        .ForMember(dest => dest.ImageSource, opt => opt.MapFrom(src => defaultImagePath + src.Product.ImageSource));
                                                        //.ForMember(dest => dest.Seller, opt => opt.MapFrom(src => src.Product.Seller));
        }

        private string GetOrderStatus(Order order)
        {
            return order.IsCanceled ? OrderStatuses.CANCELED.ToString() 
                                    : order.DeliveryTime > DateTime.Now ? OrderStatuses.ONGOING.ToString()
                                                                        : OrderStatuses.DELIVERED.ToString();
        }
    }
}
