using Domain.Enums;
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
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasIndex(x => x.Username).IsUnique();

            builder.HasIndex(x => x.Email).IsUnique();

            builder.Property(x => x.RowVersion).IsRowVersion();

            builder.Property(x => x.UserType)
                   .HasConversion(
                       x => x.ToString(),
                       x => Enum.Parse<UserTypes>(x)
                   );

            builder.Property(x => x.VerificationStatus)
                   .HasConversion(
                       x => x.ToString(),
                       x => Enum.Parse<VerificationStatuses>(x)
                   );
        }
    }
}
