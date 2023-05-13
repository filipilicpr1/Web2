using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
        public double Price { get; set; }
        public DateTime OrderTime { get; set; }
        public DateTime DeliveryTime { get; set; }
        public bool IsCanceled { get; set; }
        public Guid BuyerId { get; set; }
        public List<OrderProduct> OrderProducts { get; set; }
        public byte[] RowVersion { get; set; }
    }
}
