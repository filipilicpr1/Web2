using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.OrderDTOs
{
    public class CreateOrderDTO
    {
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
        public IEnumerable<CreateOrderProductDTO> OrderProducts { get; set; }
        public Guid BuyerId { get; set; }
    }
}
