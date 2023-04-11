using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Article
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        public string ImageSource { get; set; }
        public Guid SellerId { get; set; }
        public User Seller { get; set; }
        public List<Order> Orders { get; set; }
    }
}
