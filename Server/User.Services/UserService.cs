using AutoMapper;
using Contracts.Common;
using Contracts.UserDTOs;
using Domain.AppSettings;
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
using Services.Helpers;
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
using static System.Net.Mime.MediaTypeNames;
using Domain.Utilities;
using Google.Apis.Auth;
using Newtonsoft.Json.Linq;
using Google.Apis.Auth.OAuth2;
using Contracts.ProductDTOs;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IOptions<AppSettings> _settings;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IEmailUtility _emailUtility;
        private readonly ITokenUtility _tokenUtility;
        //private readonly DaprClient _daprClient;
        public UserService(IOptions<AppSettings> settings, IUnitOfWork unitOfWork, IMapper mapper, IHostEnvironment hostEnvironment, IEmailUtility emailUtility, ITokenUtility tokenUtility)//, DaprClient daprClient)
        {
            _settings = settings;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hostEnvironment = hostEnvironment;
            _emailUtility = emailUtility;
            _tokenUtility = tokenUtility;
            //_daprClient = daprClient;
        }

        public async Task<DisplayUserDTO> GetById(Guid id)
        {
            await Console.Out.WriteLineAsync(id.ToString());
            User user = await _unitOfWork.Users.Find(id);
            if (user == null) 
            {
                throw new NotFoundException("User with id " + id + " does not exist");
            }

            return _mapper.Map<DisplayUserDTO>(user);
        }

        public async Task<AuthDTO> Login(LoginDTO loginDTO)
        {
            //var items = await _daprClient.InvokeMethodAsync<PagedListDTO<DisplayProductDTO>>(HttpMethod.Get, "productapi", "api/products/all");
            //await Console.Out.WriteLineAsync(items.TotalPages.ToString());
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

            return new AuthDTO()
            {
                Token = _tokenUtility.CreateToken(user.Id, user.Username, user.UserType, _settings.Value.SecretKey, _settings.Value.TokenIssuer, _settings.Value.TokenDuration)
            };
        }

        public async Task<DisplayUserDTO> RegisterUser(RegisterUserDTO registerUserDTO)
        {
            string errorMessage;
            bool userFiledsAreValid = ValidateUserFields(registerUserDTO, out errorMessage);
            if(!userFiledsAreValid)
            {
                throw new BadRequestException(errorMessage);
            }

            registerUserDTO.ImageSource ??= _settings.Value.DefaultImageName;

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
            user.FinishedRegistration = true;

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

            if (!user.FinishedRegistration)
            {
                throw new BadRequestException("Please finish the registration first");
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

            string currentImageName = user.ImageSource.Split('/').Last<string>();
            if (!String.Equals(currentImageName, _settings.Value.DefaultImageName) && updateUserDTO.Image != null)
            {
                ImageHelper.DeleteImage(currentImageName, _hostEnvironment.ContentRootPath);
            }

            user.ImageSource = updateUserDTO.Image == null ? 
                               user.ImageSource : 
                               await ImageHelper.SaveImage(updateUserDTO.Image, id, _hostEnvironment.ContentRootPath);

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

            if (!user.FinishedRegistration)
            {
                throw new BadRequestException("Please finish the registration first");
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

        public async Task<DisplayUserDTO> VerifyUser(Guid id, bool isAccepted)
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
            await _emailUtility.SendEmail(user.Email, user.Name, user.IsVerified);
            return _mapper.Map<DisplayUserDTO>(user);
        }
        public async Task<AuthDTO> GoogleLogin(GoogleLoginDTO googleLoginDTO)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { _settings.Value.GoogleClientId }
            };

            var response = await GoogleJsonWebSignature.ValidateAsync(googleLoginDTO.Token, settings);

            User user = await _unitOfWork.Users.FindByEmail(response.Email);
            if (user != null)
            {
                return new AuthDTO()
                {
                    Token = _tokenUtility.CreateToken(user.Id, user.Username, user.UserType, _settings.Value.SecretKey, _settings.Value.TokenIssuer, _settings.Value.TokenDuration)
                };
            }

            User newUser = new User()
            {
                Email = response.Email,
                Name = response.GivenName,
                LastName = response.FamilyName,
                Address = _settings.Value.DefaultAddress,
                BirthDate = DateTime.Parse(_settings.Value.DefaultBirthDate),
                Password = BCrypt.Net.BCrypt.HashPassword(_settings.Value.DefaultPassword, BCrypt.Net.BCrypt.GenerateSalt()),
                ImageSource = response.Picture,
                UserType = UserTypes.BUYER,
                IsVerified = false,
                VerificationStatus = VerificationStatuses.ACCEPTED,
                FinishedRegistration = false
            };

            await _unitOfWork.Users.Add(newUser);
            newUser.Username = newUser.Name + newUser.Id;
            await _unitOfWork.Save();

            return new AuthDTO()
            {
                Token = _tokenUtility.CreateToken(newUser.Id, newUser.Username, newUser.UserType, _settings.Value.SecretKey, _settings.Value.TokenIssuer, _settings.Value.TokenDuration)
            };
        }

        public async Task<AuthDTO> FinishRegistration(Guid id, string username, FinishRegistrationDTO finishRegistrationDTO)
        {
            User user = await _unitOfWork.Users.Find(id);
            if(user == null)
            {
                throw new BadRequestException("User with id " + id + " does not exist");
            }

            if(!String.Equals(user.Username, username))
            {
                throw new BadRequestException("You can finish only your registration process");
            }

            if(user.FinishedRegistration)
            {
                throw new BadRequestException("You have already finished your registration");
            }

            string message;
            bool fieldsAreValid = ValidateFinishRegistration(finishRegistrationDTO, out message);
            if(!fieldsAreValid)
            {
                throw new BadRequestException(message);
            }

            bool usernameExists = await _unitOfWork.Users.FindByUsername(finishRegistrationDTO.Username) != null;
            if (usernameExists)
            {
                throw new BadRequestException("User with username " + finishRegistrationDTO.Username + " already exists");
            }

            user.Username = finishRegistrationDTO.Username;
            user.Address = finishRegistrationDTO.Address;
            user.BirthDate = finishRegistrationDTO.BirthDate;
            user.UserType = Enum.Parse<UserTypes>(finishRegistrationDTO.UserType);
            user.IsVerified = user.UserType != UserTypes.SELLER;
            user.VerificationStatus = user.IsVerified ? VerificationStatuses.ACCEPTED : VerificationStatuses.PENDING;
            user.Password = BCrypt.Net.BCrypt.HashPassword(finishRegistrationDTO.Password, BCrypt.Net.BCrypt.GenerateSalt());
            user.FinishedRegistration = true;
            await _unitOfWork.Save();

            return new AuthDTO() 
            { 
                Token = _tokenUtility.CreateToken(user.Id, user.Username, user.UserType, _settings.Value.SecretKey, _settings.Value.TokenIssuer, _settings.Value.TokenDuration) 
            };
        }
        public async Task<PagedListDTO<DisplayUserDTO>> GetAllSellers(int page)
        {
            IEnumerable<User> users = await _unitOfWork.Users.GetSellers(false);
            return PaginationHelper<User, DisplayUserDTO>.CreatePagedListDTO(users, page, _settings.Value.UsersPageSize, _mapper);
        }

        public async Task<PagedListDTO<DisplayUserDTO>> GetVerifiedSellers(int page)
        {
            IEnumerable<User> users = await _unitOfWork.Users.GetSellers(true);
            return PaginationHelper<User, DisplayUserDTO>.CreatePagedListDTO(users, page, _settings.Value.UsersPageSize, _mapper);
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

            bool usernameIsValid = ValidateUsername(registerUserDTO.Username, out message);
            if (!usernameIsValid) 
            {
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

            if (password.Length < _settings.Value.MinPasswordLength)
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

            bool addressIsValid = ValidateAddress(address, out message);
            if (!addressIsValid)
            {
                return false;
            }

            bool birthDateIsValid = ValidateBirthDate(birthDate, out message);
            if(!birthDateIsValid)
            {
                return false;
            }

            return true;
        }
        
        private bool ValidateBirthDate(DateTime birthDate, out string message)
        {
            message = "";
            if (birthDate.Year < _settings.Value.MinBirthYear || birthDate > DateTime.Now)
            {
                message = "Invalid birth date";
                return false;
            }

            return true;
        }

        private bool ValidateUsername(string username, out string message)
        {
            message = "";
            if (String.IsNullOrWhiteSpace(username))
            {
                message = "Username can't be empty";
                return false;
            }

            return true;
        }

        private bool ValidateAddress(string address, out string message)
        {
            message = "";
            if (String.IsNullOrWhiteSpace(address))
            {
                message = "Address can't be empty";
                return false;
            }

            return true;
        }

        private bool ValidateFinishRegistration(FinishRegistrationDTO finishRegistrationDTO, out string message)
        {
            message = "";
            bool passwordIsValid = ValidatePassword(finishRegistrationDTO.Password, out message);
            if (!passwordIsValid)
            {
                return false;
            }

            bool usernameIsValid = ValidateUsername(finishRegistrationDTO.Username, out message);
            if (!usernameIsValid)
            {
                return false;
            }

            bool addressIsValid = ValidateAddress(finishRegistrationDTO.Address, out message);
            if (!addressIsValid)
            {
                return false;
            }

            bool birthDateIsValid = ValidateBirthDate(finishRegistrationDTO.BirthDate, out message);
            if (!birthDateIsValid) 
            {
                return false;
            }

            if (finishRegistrationDTO.UserType == null || (!String.Equals(finishRegistrationDTO.UserType.Trim().ToLower(), "seller") &&
                                                           !String.Equals(finishRegistrationDTO.UserType.Trim().ToLower(), "buyer")))
            {
                message = "Invalid user type";
                return false;
            }

            return true;
        }
    }
}
