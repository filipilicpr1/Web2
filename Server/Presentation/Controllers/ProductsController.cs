using Contracts.Common;
using Contracts.ProductDTOs;
using Contracts.UserDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            DisplayProductDTO displayProductDTO = await _productService.GetById(id);
            return Ok(displayProductDTO);
        }

        [HttpPost]
        [Authorize(Roles = "seller")]
        public async Task<IActionResult> Post([FromForm] CreateProductDTO createProductDTO)
        {
            DisplayProductDTO displayProductDTO = await _productService.CreateProduct(createProductDTO, User.Identity.Name);
            return CreatedAtAction(nameof(Get), new { id = displayProductDTO.Id }, displayProductDTO);
        }
    }
}
