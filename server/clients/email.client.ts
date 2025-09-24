import { sendEmail as sendEmailService } from "../emailService";

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = sendEmailService;

export class EmailClient {
  async sendEmail(data: EmailData): Promise<void> {
    try {
      await sendEmail(data);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }

  async sendTicketNotification(data: {
    customerEmail: string;
    ticketId: string;
    ticketTitle: string;
    status: string;
    priority: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.customerEmail,
      subject: `New Ticket Created: ${data.ticketTitle}`,
      html: `
        <h2>Your ticket has been created</h2>
        <p><strong>Ticket ID:</strong> #${data.ticketId}</p>
        <p><strong>Title:</strong> ${data.ticketTitle}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Priority:</strong> ${data.priority}</p>
      `,
    });
  }
}