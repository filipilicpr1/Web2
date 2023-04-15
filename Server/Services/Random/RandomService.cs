using Domain.Random;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Random
{
    public class RandomService : IRandomService
    {
        private System.Random random;
        public RandomService() 
        {
            random = new System.Random();
        }
        public int GetRandomNumberInRange(int lowerLimit, int upperLimit)
        {
            return random.Next(lowerLimit, upperLimit);
        }
    }
}
