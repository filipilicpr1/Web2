using AutoMapper;
using Contracts.UserDTOs;
using Domain.AppSettings;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Services.Abstractions;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IOptions<AppSettings> _settings;
        public UserService(IOptions<AppSettings> settings, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _settings = settings;
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

        public async Task<AuthDTO> Login(LoginDTO loginDTO)
        {
            string message = "";

            bool emailISValid = ValidateEmail(loginDTO.Email, out message);
            if (!emailISValid)
            {
                throw new BadRequestException(message);
            }

            bool passwordIsValid = ValidatePassword(loginDTO.Password, out message);
            if (!passwordIsValid)
            {
                throw new BadRequestException(message);
            }

            User user = await _unitOfWork.Users.FindByEmail(loginDTO.Email);
            if(user == null)
            {
                throw new BadRequestException("Incorrect email");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password))
            {
                throw new BadRequestException("Incorrect password");
            }

            if(!user.IsVerified)
            {
                throw new BadRequestException("User is not verified");
            }

            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Role, user.UserType.ToString().ToLower()));
            claims.Add(new Claim(ClaimTypes.Name, user.Username));
            claims.Add(new Claim("id", user.Id.ToString()));

            var signinCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Value.SecretKey)),
                SecurityAlgorithms.HmacSha256);

            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:7126",
                claims: claims,
                expires: DateTime.Now.AddMinutes(1000),
                signingCredentials: signinCredentials
            );

            AuthDTO authDTO = new AuthDTO()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(tokeOptions)
            };
            return authDTO;
        }

        public async Task<DisplayUserDTO> RegisterUser(RegisterUserDTO registerUserDTO)
        {
            string errorMessage;
            bool userFiledsAreValid = ValidateUserFields(registerUserDTO, out errorMessage);
            if(!userFiledsAreValid)
            {
                throw new BadRequestException(errorMessage);
            }

            registerUserDTO.ImageSource ??= Constants.DefaultImageSource;

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

            bool emailISValid = ValidateEmail(registerUserDTO.Email, out message);
            if (!emailISValid)
            {
                return false;
            }

            bool passwordIsValid = ValidatePassword(registerUserDTO.Password, out message);
            if (!passwordIsValid)
            {
                return false;
            }

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

            if (String.IsNullOrWhiteSpace(registerUserDTO.Address))
            {
                message = "Address can't be empty";
                return false;
            }            

            if (registerUserDTO.BirthDate.Year < Constants.MinBirthYear || registerUserDTO.BirthDate > DateTime.Now)
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

            return true;
        }

        private bool ValidateEmail(string email, out string message)
        {
            message = "";

            if (String.IsNullOrWhiteSpace(email))
            {
                message = "Email can't be empty";
                return false;
            }

            Regex emailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");

            if (!emailRegex.Match(email).Success)
            {
                message = "Invalid email";
                return false;
            }

            return true;
        }

        private bool ValidatePassword(string password, out string message) 
        {
            message = "";

            if (String.IsNullOrWhiteSpace(password))
            {
                message = "Password can't be empty";
                return false;
            }

            if (password.Length < Constants.MinPasswordLength)
            {
                message = "Password must have at least 4 characters";
                return false;
            }

            return true;
        }
    }
}
