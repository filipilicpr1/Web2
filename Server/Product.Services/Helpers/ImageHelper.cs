﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Helpers
{
    internal class ImageHelper
    {
        public static async Task<string> SaveImage(IFormFile imageFile, Guid id, string rootPath)
        {
            string imageName = new string(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + id.ToString() + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(rootPath, "images", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
        }

        public static void DeleteImage(string imageName, string rootPath)
        {
            var imagePath = Path.Combine(rootPath, "images", imageName);
            if (File.Exists(imagePath))
            {
                File.Delete(imagePath);
            }
        }
    }
}
