using Domain.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Utilities
{
    public class RandomUtility : IRandomUtility
    {
        private System.Random random;
        public RandomUtility() 
        {
            random = new System.Random();
        }
        public int GetRandomNumberInRange(int lowerLimit, int upperLimit)
        {
            return random.Next(lowerLimit, upperLimit);
        }
    }
}
