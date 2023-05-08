using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Common
{
    public class PagedListDTO<T> where T : class
    {
        public IReadOnlyList<T> Items { get; set; }
        public int Page {  get; set; }
        public int TotalPages { get; set; }
    }
}
