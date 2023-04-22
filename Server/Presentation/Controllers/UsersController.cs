using Contracts.Common;
using Contracts.UserDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            DisplayUserDTO displayUserDTO = await _userService.GetById(id);
            return Ok(displayUserDTO);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RegisterUserDTO registerUserDTO)
        {
            DisplayUserDTO displayUserDTO = await _userService.RegisterUser(registerUserDTO);
            return CreatedAtAction(nameof(Get), new { id = displayUserDTO.Id }, displayUserDTO);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(Guid id, [FromForm] UpdateUserDTO updateUserDTO)
        {
            DisplayUserDTO displayUserDTO = await _userService.UpdateUser(id, User.Identity.Name, updateUserDTO);
            return Ok(displayUserDTO);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            AuthDTO authDTO = await _userService.Login(loginDTO);
            return Ok(authDTO);
        }

        [HttpPut("{id}/change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordDTO changePasswordDTO)
        {
            DisplayUserDTO displayUserDTO = await _userService.ChangePassword(id, User.Identity.Name, changePasswordDTO);
            return Ok(displayUserDTO);
        }

        [HttpPut("{id}/verify")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> VerifyUser(Guid id, [FromBody]  VerifyUserDTO verifyUserDTO)
        {
            await _userService.VerifyUser(id, verifyUserDTO.IsAccepted);
            return Ok();
        }

        [HttpGet("sellers")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetSellers([FromQuery] int page)
        {
            PagedListDTO<DisplayUserDTO> displayUsers = await _userService.GetAllSellers(page);
            return Ok(displayUsers);
        }

        [HttpGet("sellers/verified")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetVerifiedSellers([FromQuery] int page)
        {
            PagedListDTO<DisplayUserDTO> displayUsers = await _userService.GetVerifiedSellers(page);
            return Ok(displayUsers);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDTO googleLoginDTO)
        {
            AuthDTO authDTO = await _userService.GoogleLogin(googleLoginDTO);
            return Ok(authDTO);
        }
    }
}
