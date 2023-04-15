using Contracts.Common;
using Contracts.OrderDTOs;
using Contracts.ProductDTOs;
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

        [HttpGet("buyer/{id}/in-progress")]
        [Authorize(Roles = "buyer")]
        public async Task<IActionResult> GetAllNonDeliveredByBuyer(Guid id, [FromQuery] int page)
        {
            PagedListDTO<DisplayOrderDTO> pagedOrders = await _orderService.GetAllNonDeliveredByBuyer(id, page);
            return Ok(pagedOrders);
        }

        [HttpGet("buyer/{id}/delivered")]
        [Authorize(Roles = "buyer")]
        public async Task<IActionResult> GetAllDeliveredByBuyer(Guid id, [FromQuery] int page)
        {
            PagedListDTO<DisplayOrderDTO> pagedOrders = await _orderService.GetAllDeliveredByBuyer(id, page);
            return Ok(pagedOrders);
        }

        [HttpGet("seller/{id}/in-progress")]
        [Authorize(Roles = "seller")]
        public async Task<IActionResult> GetAllNonDeliveredBySeller(Guid id, [FromQuery] int page)
        {
            PagedListDTO<DisplayOrderDTO> pagedOrders = await _orderService.GetAllNonDeliveredBySeller(id, page);
            return Ok(pagedOrders);
        }

        [HttpGet("seller/{id}/delivered-or-canceled")]
        [Authorize(Roles = "seller")]
        public async Task<IActionResult> GetAllDeliveredOrCanceledBySeller(Guid id, [FromQuery] int page)
        {
            PagedListDTO<DisplayOrderDTO> pagedOrders = await _orderService.GetAllDeliveredOrCanceledBySeller(id, page);
            return Ok(pagedOrders);
        }
    }
}
