using AutoMapper;
using Contracts.ProductDTOs;
using Contracts.UserDTOs;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mapping
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile(string defaultImagePath)
        {
            CreateMap<Product, DisplayProductDTO>().ForMember(dest => dest.ImageSource, opt => opt.MapFrom(src => defaultImagePath + src.ImageSource)).ReverseMap();
            CreateMap<Product, CreateProductDTO>().ForMember(dest => dest.ImageSource, opt => opt.Ignore()).ReverseMap();
        }
    }
}
