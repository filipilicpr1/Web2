using Contracts.Common;
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
        Task<DisplayUserDTO> UpdateUser(Guid id, string username, UpdateUserDTO updateUserDTO);
        Task<DisplayUserDTO> ChangePassword(Guid id, string username, ChangePasswordDTO changePasswordDTO);
        Task<DisplayUserDTO> VerifyUser(Guid id, bool isAccepted);
        Task<PagedListDTO<DisplayUserDTO>> GetAllSellers(int page);
        Task<PagedListDTO<DisplayUserDTO>> GetVerifiedSellers(int page);
        Task<AuthDTO> GoogleLogin(GoogleLoginDTO googleLoginDTO);
        Task<AuthDTO> FinishRegistration(Guid id, string username, FinishRegistrationDTO finishRegistrationDTO);
    }
}
