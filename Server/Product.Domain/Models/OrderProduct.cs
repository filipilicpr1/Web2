using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class OrderProduct
    {
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
        public Order Order { get; set; }
        public Product Product { get; set; }
        public byte[] RowVersion { get; set; }
    }
    
}
