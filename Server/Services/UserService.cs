using AutoMapper;
using Contracts.UserDTOs;
using Domain.Exceptions;
using Domain.Repositories;
using Microsoft.Extensions.Options;
using Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public Task<DisplayUserDTO> GetById(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<DisplayUserDTO> RegisterUser(RegisterUserDTO registerUserDTO)
        {
            throw new BadRequestException("Los zahtev");
        }
    }
}
