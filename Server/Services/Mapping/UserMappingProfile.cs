using AutoMapper;
using Contracts.UserDTOs;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mapping
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, DisplayUserDTO>().ForMember(dest => dest.ImageSource, opt=>opt.MapFrom(src => Constants.DefaultImagePath + src.ImageSource)).ReverseMap();
            CreateMap<User, RegisterUserDTO>().ReverseMap();
        }
    }
}
