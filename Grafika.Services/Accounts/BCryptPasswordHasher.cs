using Microsoft.AspNetCore.Identity;

namespace Grafika.Services.Accounts
{
    internal class BCryptPasswordHasher : IPasswordHasher<User>
    {
        public string HashPassword(User user, string password)
        {
            return HashPassword(password);
        }

        public PasswordVerificationResult VerifyHashedPassword(User user, string hashedPassword, string providedPassword)
        {
            if (providedPassword != null && BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword))
                    return PasswordVerificationResult.Success;
            return PasswordVerificationResult.Failed;
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, 8);
        }

    }
}
