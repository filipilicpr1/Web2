using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common
{
    public class PagedList<T> : List<T>
    {
        private const int pageSize = 4;
        public int CurrentPage { get; private set; }
        public int TotalPages { get; private set; }

        public PagedList(List<T> items, int pageNumber, int totalPages)
        {
            CurrentPage = pageNumber;
            TotalPages = totalPages;
            AddRange(items);
        }

        public static PagedList<T> ToPagedList(IEnumerable<T> source, int pageNumber)
        {
            int count = source.Count();
            int totalPages = (int)Math.Ceiling(count / (double)pageSize);
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageNumber > totalPages)
            {
                pageNumber = totalPages;
            }
            if (count == 0)
            {
                var noItems = source.ToList();
                return new PagedList<T>(noItems, pageNumber, totalPages);
            }
            var items = source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            return new PagedList<T>(items, pageNumber, totalPages);
        }
    }
}
