using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        public string ImageSource { get; set; }
        public Guid SellerId { get; set; }
        public User Seller { get; set; }
        public bool IsDeleted { get; set; }
        public List<OrderProduct> OrderProducts { get; set; }
        public byte[] RowVersion { get; set; }
    }
}
