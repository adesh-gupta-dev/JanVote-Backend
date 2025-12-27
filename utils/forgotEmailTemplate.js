export const forgotEmailTemplate = (resetPasswordUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset - Online Voting System</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f5f9; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#1a3d7c; padding:25px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:26px;">Online Voting System</h1>
              <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">
                Secure • Transparent • Reliable
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px;">
              <h2 style="color:#1a3d7c; margin-top:0;">
                Reset Your Account Password
              </h2>

              <p style="color:#444; line-height:1.7; font-size:15px;">
                We received a request to reset the password for your Online Voting System account.
                For your security, password resets are time-sensitive and require confirmation.
              </p>

              <p style="color:#444; line-height:1.7; font-size:15px;">
                Click the button below to securely reset your password:
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:35px 0;">
                <a href="${resetPasswordUrl}"
                   style="background:#1a3d7c; color:#ffffff; text-decoration:none;
                          padding:14px 32px; border-radius:6px;
                          font-size:16px; font-weight:bold; display:inline-block;">
                  Reset Password
                </a>
              </div>

              <p style="color:#555; font-size:14px;">
                ⏳ This reset link will expire in <strong>15 minutes</strong>.
              </p>

              <p style="color:#555; font-size:14px;">
                If the button does not work, copy and paste the following URL into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px;">
                <a href="${resetPasswordUrl}" style="color:#1a3d7c;">
                  ${resetPasswordUrl}
                </a>
              </p>

              <hr style="margin:35px 0; border:none; border-top:1px solid #e5e7eb;">

              <!-- Security Notice -->
              <p style="color:#777; font-size:13px; line-height:1.6;">
                If you did not request a password reset, please ignore this email.
                Your account remains secure and no changes will be made.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f7f9fc; padding:20px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#888;">
                © ${new Date().getFullYear()} Online Voting System<br>
                Ensuring fair, secure, and transparent elections
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
};
