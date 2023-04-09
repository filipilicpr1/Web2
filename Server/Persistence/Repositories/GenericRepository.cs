using Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly ProjectDbContext _dbContext;

        public GenericRepository(ProjectDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<T> Add(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
            return entity;
        }

        public async Task<T> Find(Guid id)
        {
            T entity = await _dbContext.Set<T>().FindAsync(id);
            return entity;
        }

        public async Task<List<T>> GetAll()
        {
            List<T> entities = await _dbContext.Set<T>().ToListAsync();
            return entities;
        }

        public void Remove(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
        }
    }
}
