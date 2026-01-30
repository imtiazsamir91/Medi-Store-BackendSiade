import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL !],
   
    emailAndPassword: { 
        enabled: true,
        autoSignIn:false,
        requireEmailVerification:true,
    },
      emailVerification: {
        sendOnSignUp: true,

    sendVerificationEmail: async ( { user, url, token }, request) => {
       try{
         const verificationUrl=`${process.env.APP_URL}/verify-email?token=${token}`;
       
    const info = await transporter.sendMail({
    from: '"Medi-Store" <medistore@gmail.com>',
    to: user.email!,
    subject: "Please verify your email address",
   
    html:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td style="background:#2e7d32; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0;">Medi-Store 💊</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="color:#333;">Verify your email address</h2>

                <p style="color:#555; font-size:15px; line-height:1.6;">
                  Hi <strong>{{userName}}</strong>,
                </p>

                <p style="color:#555; font-size:15px; line-height:1.6;">
                  Thanks for signing up with <strong>Medi-Store</strong>!  
                  Please confirm your email address by clicking the button below.
                </p>

                <!-- Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a
                    href="${verificationUrl}"
                    target="_blank"
                    style="
                      background:#2e7d32;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      font-size:16px;
                      border-radius:6px;
                      display:inline-block;
                    "
                  >
                    Verify Email
                  </a>
                </div>

                <p style="color:#777; font-size:14px; line-height:1.6;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all; font-size:13px; color:#2e7d32;">
                 ${verificationUrl}
                </p>

                <p style="color:#999; font-size:13px; margin-top:30px;">
                  If you didn’t create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#777;">
                © 2026 Medi-Store. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
  });

  console.log("Message sent:", info.messageId);
       } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
       }
    },
  },
});