export const otpVerificationEmailTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification - Online Voting System</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f5f9; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff; border-radius:10px;
                      box-shadow:0 6px 20px rgba(0,0,0,0.1); overflow:hidden;">

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
                OTP Verification Required
              </h2>

              <p style="color:#444; font-size:15px; line-height:1.7;">
                To continue with your request, please verify your identity
                using the One-Time Password (OTP) below.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  font-size:32px;
                  letter-spacing:6px;
                  padding:14px 30px;
                  background:#f1f5ff;
                  color:#1a3d7c;
                  font-weight:bold;
                  border-radius:8px;
                  border:1px dashed #1a3d7c;">
                  ${otp}
                </span>
              </div>

              <p style="color:#555; font-size:14px;">
                ⏳ This OTP is valid for <strong>10 minutes</strong>.
              </p>

              <p style="color:#555; font-size:14px;">
                Please do not share this OTP with anyone.
                Our team will never ask for your OTP.
              </p>

              <hr style="margin:35px 0; border:none; border-top:1px solid #e5e7eb;">

              <p style="color:#777; font-size:13px; line-height:1.6;">
                If you did not request this verification, please ignore this email.
                Your account remains secure.
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
