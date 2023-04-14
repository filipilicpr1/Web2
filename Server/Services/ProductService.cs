using AutoMapper;
using Contracts.ProductDTOs;
using Domain.AppSettings;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Repositories;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Services.Abstractions;
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
        private readonly IHostEnvironment _hostEnvironment;
        public ProductService(IUnitOfWork unitOfWork, IMapper mapper, IHostEnvironment hostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hostEnvironment = hostEnvironment;
        }
        public async Task<DisplayProductDTO> GetById(Guid id)
        {
            Product product = await _unitOfWork.Products.GetDetailed(id);
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

            User seller = await _unitOfWork.Users.FindByUsername(sellerUsername);
            if(seller == null) 
            {
                throw new BadRequestException("There is no seller with username " + sellerUsername);
            }

            if(seller.VerificationStatus != VerificationStatuses.ACCEPTED)
            {
                throw new BadRequestException("Seller with username " + sellerUsername + " is not verified");
            }

            Product product = _mapper.Map<Product>(createProductDTO);
            product.SellerId = seller.Id;
            product.Seller = seller;
            product.IsDeleted = false;
            await _unitOfWork.Products.Add(product);

            product.ImageSource = createProductDTO.ImageSource == null ? 
                                  Constants.DefaultProductImageName : 
                                  await ImageHelper.SaveImage(createProductDTO.ImageSource, product.Id, _hostEnvironment.ContentRootPath);
            await _unitOfWork.Save();
            
            return _mapper.Map<DisplayProductDTO>(product);
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
    }
}
