using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Configurations
{
    public class ProductOrderConfiguration : IEntityTypeConfiguration<OrderProduct>
    {
        public void Configure(EntityTypeBuilder<OrderProduct> builder)
        {
            builder.HasKey(x => new {x.OrderId, x.ProductId});

            builder.Property(x => x.RowVersion).IsRowVersion();

            builder.HasOne(x => x.Order)
               .WithMany(x => x.OrderProducts)
               .HasForeignKey(x => x.OrderId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.Product)
               .WithMany(x => x.OrderProducts)
               .HasForeignKey(x => x.ProductId)
               .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
