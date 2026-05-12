export function otpTemplate(OTP){
    return {
        subject: "🔐 Your Verification Code",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background:#f1f5f9; font-family:'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:50px 20px;">

        <!-- Main Card -->
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- Header Section -->
          <tr>
            <td style="padding:28px 30px; background:#f8fafc; border-bottom:1px solid #e2e8f0;">
              <h2 style="margin:0; font-size:20px; color:#0f172a; font-weight:600;">
                Verify your email
              </h2>
              <p style="margin:6px 0 0; font-size:13px; color:#64748b;">
                Secure access to your account
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px 30px; text-align:center;">

              <p style="margin:0; font-size:14px; color:#475569;">
                Use the code below to continue
              </p>

              <!-- OTP BOX -->
              <div style="
                margin:28px auto;
                display:inline-block;
                padding:18px 30px;
                font-size:32px;
                font-weight:700;
                letter-spacing:10px;
                border-radius:12px;
                background:#eef2ff;
                color:#4338ca;
                border:1px solid #c7d2fe;
                box-shadow:inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 14px rgba(99,102,241,0.15);
              ">
                ${OTP}
              </div>

              <!-- Info Box -->
              <div style="
                margin-top:20px;
                padding:12px 16px;
                border-radius:8px;
                background:#f8fafc;
                border:1px solid #e2e8f0;
                font-size:13px;
                color:#64748b;
              ">
                ⏳ Valid for <strong>5 minutes</strong><br/>
                🔒 Keep this code private
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0;">
              <p style="margin:0;">
                © 2026 <span style="color:#6366f1; font-weight:600;">YourApp</span>
              </p>
              <p style="margin-top:6px;">
                Need help? 
                <a href="mailto:support@yourapp.com" style="color:#6366f1; text-decoration:none;">
                  Contact support
                </a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
    }
}