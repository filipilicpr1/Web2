using Contracts.Common;
using Contracts.OrderDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Abstractions
{
    public interface IOrderService
    {
        Task<DisplayOrderDTO> CreateOrder(string buyerUsername, CreateOrderDTO createOrderDTO);
        Task<DisplayOrderDTO> GetById(Guid id);
        Task<DisplayOrderDTO> CancelOrder(string buyerUsername, Guid id);
        Task<PagedListDTO<DisplayOrderDTO>> GetAllNonDeliveredOrdersByBuyer(Guid id, int page);
        Task<PagedListDTO<DisplayOrderDTO>> GetAllDeliveredOrdersByBuyer(Guid id, int page);
    }
}
