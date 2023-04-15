using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Random
{
    public interface IRandomService
    {
        int GetRandomNumberInRange(int lowerLimit, int upperLimit);
    }
}
