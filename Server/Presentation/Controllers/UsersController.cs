using Contracts.UserDTOs;
using Microsoft.AspNetCore.Authorization;
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
    }
}
