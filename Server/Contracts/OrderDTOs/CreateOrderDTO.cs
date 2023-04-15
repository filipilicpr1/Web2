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
        public int Amount { get; set; }
        public Guid ProductId { get; set; }
        public Guid BuyerId { get; set; }
    }
}
