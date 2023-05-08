using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.OrderDTOs
{
    public class CreateOrderProductDTO
    {
        public Guid ProductId { get; set; }
        public int Amount { get; set; }
    }
}
