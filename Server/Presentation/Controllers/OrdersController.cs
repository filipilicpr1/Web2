using Contracts.OrderDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            DisplayOrderDTO displayOrderDTO = await _orderService.GetById(id);
            return Ok(displayOrderDTO);
        }

        [HttpPost]
        [Authorize(Roles = "buyer")]
        public async Task<IActionResult> Post([FromBody] CreateOrderDTO createOrderDTO)
        {
            DisplayOrderDTO displayOrderDTO = await _orderService.CreateOrder(User.Identity.Name, createOrderDTO);
            return CreatedAtAction(nameof(Get), new { id = displayOrderDTO.Id }, displayOrderDTO);
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "buyer")]
        public async Task<IActionResult> CancelOrder(Guid id)
        {
            DisplayOrderDTO displayOrderDTO = await _orderService.CancelOrder(User.Identity.Name, id);
            return Ok(displayOrderDTO);
        }
    }
}
