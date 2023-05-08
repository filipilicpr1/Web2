using AutoMapper;
using Domain.AppSettings;
using Domain.Models;
using Domain.Repositories;
using Domain.Utilities;
using Microsoft.Extensions.Options;
using AutoMapper.Internal;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;

namespace Services.Utilities
{
    public class EmailUtility : IEmailUtility
    {
        private readonly IOptions<AppSettings> _settings;
        public EmailUtility(IOptions<AppSettings> settings)
        {
            _settings = settings;
        }
        public async Task SendEmail(string email, string name, bool isAccepted)
        {

            string htmlContent = "<p>" + "Your request has been " + (isAccepted ? "accepted." : "rejected.") + "</p>";
            var mail = new MimeMessage();
            mail.Sender = MailboxAddress.Parse(_settings.Value.Email);
            mail.To.Add(MailboxAddress.Parse(email));

            mail.Subject = "Verification result";

            var builder = new BodyBuilder();
            builder.HtmlBody = htmlContent;
            mail.Body = builder.ToMessageBody();
            
            var smtp = new SmtpClient();
            smtp.Connect(_settings.Value.Host, _settings.Value.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_settings.Value.Email, _settings.Value.Password);
            await smtp.SendAsync(mail);
            smtp.Disconnect(true);
        }
    }
}
