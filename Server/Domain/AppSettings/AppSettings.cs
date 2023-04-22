﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.AppSettings
{
    public class AppSettings
    {
        public string SecretKey { get; set; }
        public int MinPasswordLength { get; set; }
        public int MinBirthYear { get; set; }
        public double DeliveryFee { get; set; }
        public int MinDeliveryTime { get; set; }
        public int MaxDeliveryTime { get; set; }
        public int CancelTime { get; set; }
        public string DefaultImagePath { get; set; }
        public string DefaultImageName { get; set; }
        public string DefaultProductImageName { get; set; }
        public string DefaultAddress { get; set; }
        public string DefaultBirthDate { get; set; }
        public string DefaultPassword { get; set; }
        public int UsersPageSize { get; set; }
        public int ProductsPageSize { get; set; }
        public int OrdersPageSize { get; set; }
        public string TokenIssuer { get; set; }
        public int TokenDuration { get; set; }
        public string SendgridApi { get; set; }
        public string SendgridEmail { get; set; }
        public string SendgridName { get; set; }
        public string GoogleClientId { get; set; }
        public string GoogleClientSecret { get; set; }
    }
}
