﻿using Domain.Enums;
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
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Price).HasPrecision(4, 2);

            builder.Property(x => x.RowVersion).IsRowVersion();

            /*builder.HasOne(x => x.Buyer)
               .WithMany(x => x.Orders)
               .HasForeignKey(x => x.BuyerId)
               .OnDelete(DeleteBehavior.Cascade);*/
        }
    }
}
