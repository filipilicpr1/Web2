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
    public class ProductConfiguration : IEntityTypeConfiguration<Domain.Models.Product>
    {
        public void Configure(EntityTypeBuilder<Domain.Models.Product> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Price).HasPrecision(4, 2);

            builder.Property(x => x.RowVersion).IsRowVersion();

            /*builder.HasOne(x => x.Seller)
               .WithMany(x => x.Products)
               .HasForeignKey(x => x.SellerId)
               .OnDelete(DeleteBehavior.NoAction);*/
        }
    }
}
