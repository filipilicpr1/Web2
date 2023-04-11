using Contracts.UserDTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Abstractions
{
    public interface IUserService
    {
        Task<DisplayUserDTO> RegisterUser(RegisterUserDTO registerUserDTO);
        Task<DisplayUserDTO> GetById(Guid id);
        Task<AuthDTO> Login(LoginDTO loginDTO);
        Task<DisplayUserDTO> UpdateImage(Guid id, string username, IFormFile image);
        Task<DisplayUserDTO> UpdateUser(Guid id, string username, UpdateUserDTO updateUserDTO);
        Task<DisplayUserDTO> ChangePassword(Guid id, string username, ChangePasswordDTO changePasswordDTO);
    }
}
