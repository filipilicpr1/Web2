using AutoMapper;
using Domain.AppSettings;
using Domain.Models;
using Domain.Repositories;
using Domain.Utilities;
using Microsoft.Extensions.Options;
using SendGrid.Helpers.Mail;
using SendGrid;

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
            var client = new SendGridClient(_settings.Value.SendgridApi);
            var senderEmail = new EmailAddress(_settings.Value.SendgridEmail, _settings.Value.SendgridName);
            var receiverEmail = new EmailAddress(email, name);

            string emailSubject = "Verification result";
            string htmlContent = "<p>" + "Your request has been " + (isAccepted ? "accepted." : "denied.") + "</p>";

            var msg = MailHelper.CreateSingleEmail(senderEmail, receiverEmail, emailSubject, "", htmlContent);
            await client.SendEmailAsync(msg).ConfigureAwait(false);
        }
    }
}
