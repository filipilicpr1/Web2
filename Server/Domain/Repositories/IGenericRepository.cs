using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> Add(T entity);
        Task<IEnumerable<T>> GetAll();
        Task<T> Find(Guid id);
        void Remove(T entity);
    }
}
