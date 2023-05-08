using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Utilities
{
    public interface ITokenUtility
    {
        string CreateToken(Guid id, string username, UserTypes userType, string key, string issuer, int duration);
    }
}
