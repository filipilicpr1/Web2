using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Utilities
{
    public interface IRandomUtility
    {
        int GetRandomNumberInRange(int lowerLimit, int upperLimit);
    }
}
