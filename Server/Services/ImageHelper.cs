using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    internal class ImageHelper
    {
        public static async Task<string> SaveImage(IFormFile imageFile, Guid id, string rootPath)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + id.ToString() + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(rootPath, "../Persistence/Images", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
        }

        public static void DeleteImage(string imageName, string rootPath)
        {
            var imagePath = Path.Combine(rootPath, "../Persistence/Images", imageName);
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }
    }
}
