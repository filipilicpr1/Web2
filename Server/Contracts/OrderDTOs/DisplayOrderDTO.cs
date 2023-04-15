using Contracts.ProductDTOs;
using Contracts.UserDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.OrderDTOs
{
    public class DisplayOrderDTO
    {
        public Guid Id { get; set; }
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
        public DisplayProductDTO Product { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
        public RestrictedDisplayUserDTO Buyer { get; set; }
        public DateTime OrderTime { get; set; }
        public DateTime DeliveryTime { get; set; }
        public bool IsCanceled { get; set; }
        public string Status { get; set; }
    }
}
