using Contracts.UserDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.ProductDTOs
{
    public class DisplayProductDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        public string ImageSource { get; set; }
        public RestrictedDisplayUserDTO Seller { get; set; }
    }
}
