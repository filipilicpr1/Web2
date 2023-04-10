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
        Task<DisplayUserDTO> UpdateImage(Guid id, IFormFile image);
    }
}
