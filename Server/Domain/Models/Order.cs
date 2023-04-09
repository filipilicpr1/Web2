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
        public Guid ArticleId { get; set; }
        public Article Article { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
        public Guid BuyerId { get; set; }
        public User Buyer { get; set; }
        public DateTime OrderTime { get; set; }
        public DateTime DeliveryTime { get; set; }
        public OrderStatuses Status { get; set; }
    }
}
