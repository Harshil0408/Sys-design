export interface ISmsProvider {
  sendSms(to: string, message: string): Promise<boolean>;
}

export class TwilioSmsProvider implements ISmsProvider {
  async sendSms(to: string, message: string): Promise<boolean> {
    // Adapter integration placeholder for Twilio / SMS Gateway
    return true;
  }
}
