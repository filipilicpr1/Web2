using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Utilities
{
    public interface IEmailUtility
    {
        Task SendEmail(string email, string name, bool isAccepted);
    }
}
