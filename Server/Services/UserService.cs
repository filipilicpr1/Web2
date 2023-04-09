using AutoMapper;
using Contracts.UserDTOs;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Repositories;
using Microsoft.Extensions.Options;
using Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Text.RegularExpressions;
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
        public async Task<DisplayUserDTO> GetById(Guid id)
        {
            User user = await _unitOfWork.Users.Find(id);
            if (user == null) 
            {
                throw new NotFoundException("User with id " + id + " does not exist");
            }

            return _mapper.Map<DisplayUserDTO>(user);
        }

        public async Task<DisplayUserDTO> RegisterUser(RegisterUserDTO registerUserDTO)
        {
            string errorMessage;
            bool userFiledsAreValid = ValidateUserFields(registerUserDTO, out errorMessage);
            if(!userFiledsAreValid)
            {
                throw new BadRequestException(errorMessage);
            }

            registerUserDTO.ImageSource ??= "default";

            bool usernameExists = await _unitOfWork.Users.FindByUsername(registerUserDTO.Username) != null;
            if(usernameExists) 
            {
                throw new BadRequestException("User with username " +  registerUserDTO.Username + " already exists"); 
            }

            bool emailExists = await _unitOfWork.Users.FindByEmail(registerUserDTO.Email) != null;
            if(emailExists)
            {
                throw new BadRequestException("User with email " + registerUserDTO.Email + " already exists");
            }

            User user = _mapper.Map<User>(registerUserDTO);
            user.IsVerified = user.UserType != UserTypes.SELLER;
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, BCrypt.Net.BCrypt.GenerateSalt());
            
            await _unitOfWork.Users.Add(user);
            await _unitOfWork.Save();
            
            return _mapper.Map<DisplayUserDTO>(user);
        }

        private bool ValidateUserFields(RegisterUserDTO registerUserDTO, out string message)
        {
            message = "";

            if (String.IsNullOrWhiteSpace(registerUserDTO.Username))
            {
                message = "Username can't be empty";
                return false;
            }

            if (String.IsNullOrWhiteSpace(registerUserDTO.Name))
            {
                message = "Name can't be empty";
                return false;
            }

            if (String.IsNullOrWhiteSpace(registerUserDTO.LastName))
            {
                message = "Last name can't be empty";
                return false;
            }

            if (String.IsNullOrWhiteSpace(registerUserDTO.Email))
            {
                message = "Email can't be empty";
                return false;
            }

            if (String.IsNullOrWhiteSpace(registerUserDTO.Address))
            {
                message = "Address can't be empty";
                return false;
            }

            if (String.IsNullOrWhiteSpace(registerUserDTO.Password))
            {
                message = "Password can't be empty";
                return false;
            }

            if (registerUserDTO.BirthDate.Year < 1900 || registerUserDTO.BirthDate > DateTime.Now)
            {
                message = "Invalid birth date";
                return false;
            }    

            if (registerUserDTO.UserType == null || (!String.Equals(registerUserDTO.UserType.Trim().ToLower(), "admin") && 
                                                     !String.Equals(registerUserDTO.UserType.Trim().ToLower(), "seller") && 
                                                     !String.Equals(registerUserDTO.UserType.Trim().ToLower(), "buyer")))
            {
                message = "Invalid user type";
                return false;
            }

            Regex emailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");

            if(!emailRegex.Match(registerUserDTO.Email).Success) 
            {
                message = "Invalid email";
                return false;
            }

            if(registerUserDTO.Password.Length < 4)
            {
                message = "Password must have at least 4 characters";
                return false;
            }

            return true;
        }
    }
}
