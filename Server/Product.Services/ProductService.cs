using AutoMapper;
using Contracts.Common;
using Contracts.ProductDTOs;
using Contracts.UserDTOs;
using Dapr.Client;
using Domain.AppSettings;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Repositories;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Services.Abstractions;
using Services.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IOptions<AppSettings> _settings;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly DaprClient _daprClient;
        public ProductService(IOptions<AppSettings> settings, IUnitOfWork unitOfWork, IMapper mapper, IHostEnvironment hostEnvironment, DaprClient daprClient)
        {
            _settings = settings;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hostEnvironment = hostEnvironment;
            _daprClient = daprClient;
        }
        public async Task<DisplayProductDTO> GetById(Guid id)
        {
            Domain.Models.Product product = await _unitOfWork.Products.GetDetailed(id);
            if(product == null)
            {
                throw new NotFoundException("Product with id " + id + " does not exist");
            }
            
            return _mapper.Map<DisplayProductDTO>(product);
        }

        public async Task<DisplayProductDTO> CreateProduct(CreateProductDTO createProductDTO, string sellerUsername)
        {
            string errorMessage;
            bool productFieldsAreValid = ValidateProductFields(createProductDTO.Name, 
                                                               createProductDTO.Description, 
                                                               createProductDTO.Price, 
                                                               createProductDTO.Amount, 
                                                               out errorMessage);
            if (!productFieldsAreValid) 
            {
                throw new BadRequestException(errorMessage);
            }


            DisplayUserDTO seller = null;
            try
            {
                seller = await _daprClient.InvokeMethodAsync<DisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + createProductDTO.SellerId);
            }
            catch(Exception e)
            {
                //throw new BadRequestException("Error getting seller with id " + createProductDTO.SellerId);
                throw new BadRequestException(e.Message);
            }

            if(seller == null) 
            {
                throw new BadRequestException("Seller with id " + createProductDTO.SellerId + " does not exist");
            }

            if (!String.Equals(seller.Username, sellerUsername))
            {
                throw new BadRequestException("You can only add products for yourself");
            }

            if(!seller.IsVerified)
            {
                throw new BadRequestException("Seller with username " + sellerUsername + " is not verified");
            }

            Domain.Models.Product product = _mapper.Map<Domain.Models.Product>(createProductDTO);
            product.IsDeleted = false;
            await _unitOfWork.Products.Add(product);

            product.ImageSource = createProductDTO.ImageSource == null ? 
                                  _settings.Value.DefaultProductImageName : 
                                  await ImageHelper.SaveImage(createProductDTO.ImageSource, product.Id, _hostEnvironment.ContentRootPath);
            await _unitOfWork.Save();
            
            return _mapper.Map<DisplayProductDTO>(product);
        }
        public async Task<PagedListDTO<DisplayProductDTO>> GetAll(int page)
        {
            IEnumerable<Domain.Models.Product> products = await _unitOfWork.Products.GetAllDetailed();
            PagedListDTO<DisplayProductDTO> pagedList = PaginationHelper<Domain.Models.Product, DisplayProductDTO>.CreatePagedListDTO(products, page, _settings.Value.ProductsPageSize, _mapper);
            return await GetSellersForProducts(pagedList, products);
        }

        public async Task<PagedListDTO<DisplayProductDTO>> GetAllBySeller(Guid id, int page)
        {
            IEnumerable<Domain.Models.Product> products = await _unitOfWork.Products.GetAllDetailedBySeller(id);
            PagedListDTO<DisplayProductDTO> pagedList = PaginationHelper<Domain.Models.Product, DisplayProductDTO>.CreatePagedListDTO(products, page, _settings.Value.ProductsPageSize, _mapper);
            return await GetSellersForProducts(pagedList, products);
        }

        public async Task<DisplayProductDTO> UpdateProduct(Guid id, string sellerUsername, UpdateProductDTO updateProductDTO)
        {
            Domain.Models.Product product = await _unitOfWork.Products.GetDetailed(id);
            if(product == null || product.IsDeleted)
            {
                throw new NotFoundException("Product with id " + id + " does not exist");
            }

            DisplayUserDTO seller = null;
            try
            {
                seller = await _daprClient.InvokeMethodAsync<DisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + product.SellerId);
            }
            catch
            {
                throw new BadRequestException("Error getting seller with id " + product.SellerId);
            }

            if (seller == null)
            {
                throw new BadRequestException("Seller with id " + product.SellerId + " does not exist");
            }

            if(!String.Equals(seller.Username, sellerUsername))
            {
                throw new BadRequestException("You can only update your products");
            }

            string errorMessage;
            bool productFieldsAreValid = ValidateProductFields(updateProductDTO.Name,
                                                               updateProductDTO.Description,
                                                               updateProductDTO.Price,
                                                               updateProductDTO.Amount,
                                                               out errorMessage);
            if (!productFieldsAreValid)
            {
                throw new BadRequestException(errorMessage);
            }

            string currentImageName = product.ImageSource.Split('/').Last<string>();
            if (!String.Equals(currentImageName, _settings.Value.DefaultProductImageName) && updateProductDTO.Image != null)
            {
                ImageHelper.DeleteImage(currentImageName, _hostEnvironment.ContentRootPath);
            }

            product.ImageSource = updateProductDTO.Image == null ?
                                  product.ImageSource :
                                  await ImageHelper.SaveImage(updateProductDTO.Image, id, _hostEnvironment.ContentRootPath);

            product.Name = updateProductDTO.Name;
            product.Description = updateProductDTO.Description;
            product.Price = updateProductDTO.Price;
            product.Amount = updateProductDTO.Amount;
            await _unitOfWork.Save();

            return _mapper.Map<DisplayProductDTO>(product);
        }

        public async Task DeleteProduct(Guid id, string sellerUsername)
        {
            Domain.Models.Product product = await _unitOfWork.Products.GetDetailed(id);
            if (product == null || product.IsDeleted)
            {
                throw new NotFoundException("Product with id " + id + " does not exist");
            }

            DisplayUserDTO seller = null;
            try
            {
                seller = await _daprClient.InvokeMethodAsync<DisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + product.SellerId);
            }
            catch
            {
                throw new BadRequestException("Error getting seller with id " + product.SellerId);
            }

            if (seller == null)
            {
                throw new BadRequestException("Seller with id " + product.SellerId + " does not exist");
            }

            if (!String.Equals(seller.Username, sellerUsername))
            {
                throw new BadRequestException("You can only delete your products");
            }

            product.IsDeleted = true;
            await _unitOfWork.Save();
        }

        private bool ValidateProductFields(string name, string  description, double price, int amount, out string message) 
        {
            message = "";

            if(String.IsNullOrWhiteSpace(name)) 
            {
                message = "Name can't be empty";
                return false;
            }

            if(String.IsNullOrWhiteSpace(description)) 
            {
                message = "Description can't be empty";
                return false;
            }

            if(price < 0)
            {
                message = "Price can't be < 0";
                return false;
            }

            if(amount  < 0)
            {
                message = "Amount can't be < 0";
                return false;
            }

            return true;
        }

        private async Task<PagedListDTO<DisplayProductDTO>> GetSellersForProducts(PagedListDTO<DisplayProductDTO> pagedList, IEnumerable<Domain.Models.Product> products) 
        {
            List<Domain.Models.Product> productsList = products.ToList();
            foreach(DisplayProductDTO item in pagedList.Items)
            {
                item.Seller = await _daprClient.InvokeMethodAsync<RestrictedDisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + productsList.Find(product => product.Id == item.Id).SellerId);
            }
            /*for (int i = 0; i < productsList.Count; i++)
            {
                pagedList.Items[i].Seller = await _daprClient.InvokeMethodAsync<RestrictedDisplayUserDTO>(HttpMethod.Get, "userapi", "api/users/" + productsList[i].SellerId);
            }*/
            return pagedList;
        }
    }
}
