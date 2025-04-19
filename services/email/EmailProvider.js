import nodemailer from "nodemailer";
import { EmailService } from "./EmailService.js";

const EMAIL = "powerfulindia850@gmail.com";
const PASSWORD = "pqyc aidu fqcw sdod";

export class EmailProvider extends EmailService {
  constructor() {
    super();

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
  }

  async sendEmail(type, data, to) {
    let subject = "";
    let html = "";
    switch (type) {
      case "otp":
        subject = "Verify Your Account - Your OTP Code";
        html = this.generateOTP(data.otp);
        break;

      case "borrowedBook":
        subject = `Book Borrowed: ${data.title}`;
        html = this.generateBorrowedBookTemplate(data);
        break;

      default:
        throw new Error("Unknown email type");
    }
    try {
      const info = await this.transporter.sendMail({
        from: '"BITS Library" <powerfulindia850@gmail.com>',
        to,
        subject,
        html,
      });

      // console.log("Email sent:", info.messageId);
    } catch (error) {
      console.log("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  generateOTP(otp) {
    return `  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification - BITS Library</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
        }

        /* Main container */
        .email-container {
            max-width: 600px;
            margin: 2rem auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        /* Header section */
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
            padding: 2.5rem 1.5rem;
            text-align: center;
        }

        .header img {
            max-width: 120px;
            height: auto;
            margin-bottom: 1.5rem;
        }

        .header h1 {
            color: #ffffff;
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        /* Content section */
        .content {
            padding: 2.5rem 1.5rem;
            color: #374151;
            line-height: 1.6;
        }

        .otp-container {
            margin: 2rem 0;
            text-align: center;
        }

        .otp-code {
            display: inline-block;
            background: #f8fafc;
            padding: 1.25rem 2rem;
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #1e293b;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            margin: 1rem 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .cta-text {
            color: #4f46e5;
            font-weight: 600;
            margin: 1.5rem 0;
            font-size: 1.1rem;
        }

        /* Footer section */
        .footer {
            background: #f8fafc;
            padding: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }

        .social-links {
            margin: 1rem 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 0.5rem;
        }

        .social-links img {
            width: 24px;
            height: 24px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }

        .social-links img:hover {
            opacity: 1;
        }

        /* Responsive design */
        @media (max-width: 640px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }

            .otp-code {
                font-size: 1.5rem;
                padding: 1rem 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <table role="presentation" width="100%">
                <tr>
                    <td>
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMwlmND_JZRV7PfYxpCHMEB7JgUCImn1NZVQ&s" alt="BITS Library Logo" class="library-logo">
         
                        <h1>Verify Your Account</h1>
                        <p style="color: #e0e7ff; font-size: 1rem;">Secure access to your library account</p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="content">
            <p>Hello,</p>
            <p>Welcome to BITS Library! To complete your registration and access our digital resources, please use the following verification code:</p>

            <div class="otp-container">
                <div class="otp-code">${otp}</div>
                <p class="cta-text">Valid for 10 minutes only</p>
            </div>

            <p style="margin-top: 1.5rem;">Need help? Reply to this email or contact our support team at <a href="mailto:support@bitslibrary.com" style="color: #4f46e5; text-decoration: none;">support@bitslibrary.com</a></p>
        </div>

         
            <p>© ${new Date().getFullYear()} BITS Library. All rights reserved.</p>
            <p style="margin-top: 0.5rem; font-size: 0.75rem; color: #94a3b8;">
                This is an automated message - please do not reply directly to this email
            </p>
            <p style="margin-top: 0.5rem;">
                <a href="#" style="color: #64748b; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #64748b; text-decoration: none;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  generateBorrowedBookTemplate({
    title,
    author,
    isbn,
    bookId,
    status,
    condition,
    borrowDate,
    dueDate,
  }) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>📚 Your Book Borrowing Confirmation | BITS Library</title>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
        body {
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
           font-family: "Fira Code", monospace;
          line-height: 1.5;
          color: #334155;
        }
  
        .email-wrapper {
          max-width: 680px;
          margin: 0 auto;
          padding: 24px;
        }
  
        .header {
          text-align: center;
          padding: 32px 0;
          border-bottom: 1px solid #e2e8f0;
        }
  
        .library-logo {
          height: 48px;
          margin-bottom: 16px;
        }
         .library-cover{
         height:160px;
         width:250px;
         }
        .content-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
          margin: 24px 0;
          overflow: hidden;
        }
  
        .status-banner {
          background: #3b82f6;
          color: white;
          padding: 16px;
          text-align: center;
          font-weight: 600;
        }
  
        .content-body {
          padding: 32px;
        }
  
        .book-cover-placeholder {
          background: #f1f5f9;
          border-radius: 8px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
  
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin: 24px 0;
        }
  
        .detail-item {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
        }
  
        .detail-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 4px;
        }
  
        .detail-value {
          font-weight: 500;
          color: #0f172a;
        }
  
        .due-date-alert {
          background: #fff4e6;
          border-left: 4px solid #ff922b;
          padding: 16px;
          border-radius: 8px;
          margin: 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
  
        .cta-button {
          display: inline-block;
          background: #3b82f6;
          color: white !important;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: transform 0.2s, box-shadow 0.2s;
        }
  
        .footer {
          text-align: center;
          padding: 24px;
          color: #64748b;
          font-size: 0.875rem;
        }
  
        @media (max-width: 640px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .email-wrapper {
            padding: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMwlmND_JZRV7PfYxpCHMEB7JgUCImn1NZVQ&s" alt="BITS Library Logo" class="library-logo">
          <h1>Book Borrowing Confirmation</h1>
        </div>
  
        <div class="content-card">
          <div class="status-banner">
            📚 Currently Borrowed • Due ${dueDate}
          </div>
  
          <div class="content-body">
            <div class="book-cover-placeholder">
                <img src="https://img.freepik.com/free-photo/book-library-with-open-textbook_1150-5920.jpg?semt=ais_hybrid&w=740" alt="Book image" class="library-cover">
            </div>
  
            <h2 style="margin: 0 0 8px 0; font-size: 1.5rem;">${title}</h2>
            <p style="color: #64748b; margin: 0 0 24px 0;">by ${author}</p>
  
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">Due Date</div>
                <div class="detail-value">${dueDate}</div>
              </div> 
              <br/> 
              <div class="detail-item">
                <div class="detail-label">Book ID</div>
                <div class="detail-value">#${bookId}</div>
              </div>
              <br/>
              <div class="detail-item">
                <div class="detail-label">Condition</div>
                <div class="detail-value">${condition}</div>
              </div>
              <br/>
              <div class="detail-item">
                <div class="detail-label">ISBN</div>
                <div class="detail-value">${isbn}</div>
              </div>
              <br/>
              <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">${status}</div>
              </div>
              <br/>
              <div class="detail-item">
                <div class="detail-label">Borrowed By</div>
                <div class="detail-value">${borrowDate}</div>
              </div>
              <br/>
            </div>
  
            <div class="due-date-alert">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff922b" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <div>
                <strong>Reminder:</strong> Please return or renew by the due date<br>
                Late returns incur $5/day fine
              </div>
            </div>
  
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://bitslibrary.com/portal" class="cta-button">
                View in Library Portal
              </a>
            </div>
          </div>
        </div>
  
        <div class="footer">
          <p>© ${new Date().getFullYear()} BITS Library • All rights reserved</p>
          <p style="margin: 8px 0;">
            <a href="https://bitslibrary.com/help" style="color: #3b82f6; text-decoration: none;">Help Center</a> • 
            <a href="https://bitslibrary.com/terms" style="color: #3b82f6; text-decoration: none;">Terms of Service</a>
          </p>
          <p style="font-size: 0.75rem; color: #94a3b8;">
            This is an automated message. Please do not reply directly.<br>
            Update your email preferences <a href="https://bitslibrary.com/preferences" style="color: #3b82f6;">here</a>.
          </p>
        </div>
      </div>
    </body>
    </html>`;
  }
}
