using AutoMapper;
using Contracts.Common;
using Contracts.UserDTOs;
using Domain.AppSettings;
using Domain.Common;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
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
        private readonly IHostEnvironment _hostEnvironment;
        public UserService(IOptions<AppSettings> settings, IUnitOfWork unitOfWork, IMapper mapper, IHostEnvironment hostEnvironment)
        {
            _settings = settings;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hostEnvironment = hostEnvironment;
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

            registerUserDTO.ImageSource ??= Constants.DefaultImageName;

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
            user.VerificationStatus = user.IsVerified ? VerificationStatuses.ACCEPTED : VerificationStatuses.PENDING;
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, BCrypt.Net.BCrypt.GenerateSalt());
            
            await _unitOfWork.Users.Add(user);
            await _unitOfWork.Save();

            return _mapper.Map<DisplayUserDTO>(user);
        }

        public async Task<DisplayUserDTO> UpdateUser(Guid id, string username, UpdateUserDTO updateUserDTO)
        {
            User user = await _unitOfWork.Users.Find(id);
            if (user == null)
            {
                throw new NotFoundException("User with id " + id + " does not exist");
            }

            if (!String.Equals(user.Username, username))
            {
                throw new BadRequestException("You can only change your info");
            }

            string errorMessage;
            bool userFiledsAreValid = ValidateBasicFields(updateUserDTO.Name,
                                                          updateUserDTO.LastName, 
                                                          updateUserDTO.Address, 
                                                          updateUserDTO.BirthDate, 
                                                          out errorMessage);
            if (!userFiledsAreValid)
            {
                throw new BadRequestException(errorMessage);
            }

            user.Name = updateUserDTO.Name;
            user.LastName = updateUserDTO.LastName;
            user.Address = updateUserDTO.Address;
            user.BirthDate = updateUserDTO.BirthDate;
            await _unitOfWork.Save();

            return _mapper.Map<DisplayUserDTO>(user);
        }

        public async Task<DisplayUserDTO> ChangePassword(Guid id, string username, ChangePasswordDTO changePasswordDTO)
        {
            User user = await _unitOfWork.Users.Find(id);
            if (user == null)
            {
                throw new NotFoundException("User with id " + id + " does not exist");
            }

            if (!String.Equals(user.Username, username))
            {
                throw new BadRequestException("You can only change your password");
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDTO.CurrentPassword, user.Password))
            {
                throw new BadRequestException("Incorrect current password");
            }

            string message;
            bool passwordIsValid = ValidatePassword(changePasswordDTO.NewPassword, out message);
            if(!passwordIsValid)
            {
                throw new BadRequestException(message);
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDTO.NewPassword, BCrypt.Net.BCrypt.GenerateSalt());
            await _unitOfWork.Save();

            return _mapper.Map<DisplayUserDTO>(user);
        }

        public async Task<DisplayUserDTO> UpdateImage(Guid id, string username, IFormFile image)
        {
            User user = await _unitOfWork.Users.Find(id);
            if(user == null)
            {
                throw new NotFoundException("User with id " + id + " does not exist");
            }

            if(!String.Equals(user.Username, username))
            {
                throw new BadRequestException("You can only change your image");
            }

            string currentImageName = user.ImageSource.Split('/').Last<string>();
            if(!String.Equals(currentImageName, Constants.DefaultImageName))
            {
                ImageHelper.DeleteImage(currentImageName, _hostEnvironment.ContentRootPath);
            }

            string imageName = await ImageHelper.SaveImage(image, id, _hostEnvironment.ContentRootPath);
            user.ImageSource = imageName;
            await _unitOfWork.Save();

            return _mapper.Map<DisplayUserDTO>(user);
        }

        public async Task VerifyUser(Guid id, bool isAccepted)
        {
            User user = await _unitOfWork.Users.Find(id);
            if (user == null)
            {
                throw new NotFoundException("User with id " + id + " does not exist");
            }

            if(user.VerificationStatus != VerificationStatuses.PENDING)
            {
                throw new BadRequestException("User has already been verified");
            }

            user.IsVerified = isAccepted;
            user.VerificationStatus = isAccepted ? VerificationStatuses.ACCEPTED : VerificationStatuses.REJECTED;
            await _unitOfWork.Save();
        }
        public async Task<PagedListDTO<DisplayUserDTO>> GetAllSellers(int page)
        {
            IEnumerable<User> users = await _unitOfWork.Users.GetSellers(false);

            int count = users.Count();
            int totalPages = (int)Math.Ceiling(count / (double)Constants.UsersPageSize);
            page = page < 1 ? 1 : page;
            page = page > totalPages ? totalPages : page;
            List<User> pagedUsers = count == 0 ? users.ToList() : users.Skip((page - 1) * Constants.UsersPageSize)
                                                                       .Take(Constants.UsersPageSize)
                                                                       .ToList();

            return new PagedListDTO<DisplayUserDTO>()
            {
                Items = _mapper.Map<IReadOnlyList<DisplayUserDTO>>(pagedUsers),
                Page = page,
                TotalPages = totalPages
            };
        }

        public async Task<PagedListDTO<DisplayUserDTO>> GetVerifiedSellers(int page)
        {
            IEnumerable<User> users = await _unitOfWork.Users.GetSellers(true);

            int count = users.Count();
            int totalPages = (int)Math.Ceiling(count / (double)Constants.UsersPageSize);
            page = page < 1 ? 1 : page;
            page = page > totalPages ? totalPages : page;
            List<User> pagedUsers = count == 0 ? users.ToList() : users.Skip((page - 1) * Constants.UsersPageSize)
                                                                       .Take(Constants.UsersPageSize)
                                                                       .ToList();

            return new PagedListDTO<DisplayUserDTO>()
            {
                Items = _mapper.Map<IReadOnlyList<DisplayUserDTO>>(pagedUsers),
                Page = page,
                TotalPages = totalPages
            };
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

            bool basicFieldsAreValid = ValidateBasicFields(registerUserDTO.Name,
                                                           registerUserDTO.LastName, 
                                                           registerUserDTO.Address, 
                                                           registerUserDTO.BirthDate, 
                                                           out message);
            if (!basicFieldsAreValid) 
            {
                return false;
            }

            if (String.IsNullOrWhiteSpace(registerUserDTO.Username))
            {
                message = "Username can't be empty";
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

        private bool ValidateBasicFields(string name, string lastName, string address, DateTime birthDate, out string message)
        {
            message = "";

            if (String.IsNullOrWhiteSpace(name))
            {
                message = "Name can't be empty";
                return false;
            }

            if (String.IsNullOrWhiteSpace(lastName))
            {
                message = "Last name can't be empty";
                return false;
            }

            if (String.IsNullOrWhiteSpace(address))
            {
                message = "Address can't be empty";
                return false;
            }

            if (birthDate.Year < Constants.MinBirthYear || birthDate > DateTime.Now)
            {
                message = "Invalid birth date";
                return false;
            }

            return true;
        }
    }
}
