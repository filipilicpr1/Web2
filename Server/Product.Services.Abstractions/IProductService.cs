using Contracts.Common;
using Contracts.ProductDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Abstractions
{
    public interface IProductService
    {
        Task<DisplayProductDTO> CreateProduct(CreateProductDTO createProductDTO, string sellerUsername);
        Task<DisplayProductDTO> GetById(Guid id);
        Task<PagedListDTO<DisplayProductDTO>> GetAll(int page);
        Task<PagedListDTO<DisplayProductDTO>> GetAllBySeller(Guid id, int page);
        Task<DisplayProductDTO> UpdateProduct(Guid id, string sellerUsername, UpdateProductDTO updateProductDTO);
        Task DeleteProduct(Guid id, string sellerUsername);
    }
}
