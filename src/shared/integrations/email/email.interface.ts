export interface IEmailProvider {
  sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean>;
}

export class SendGridEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    // Adapter integration placeholder for SendGrid / SES
    return true;
  }
}
