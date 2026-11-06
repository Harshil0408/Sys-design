export interface IWhatsAppProvider {
  sendMessage(to: string, templateName: string, params: Record<string, string>): Promise<boolean>;
}

export class MetaWhatsAppProvider implements IWhatsAppProvider {
  async sendMessage(to: string, templateName: string, params: Record<string, string>): Promise<boolean> {
    // Adapter integration placeholder for Meta WhatsApp Cloud API
    return true;
  }
}
