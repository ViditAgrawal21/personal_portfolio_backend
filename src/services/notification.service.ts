import { config } from '../config';
import { logger } from '../utils/logger';

interface InquiryData {
  id: string;
  clientName: string;
  email: string;
  serviceType?: string | null;
  companyName?: string | null;
  phoneNumber?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  projectDetails: string | null;
  createdAt: Date;
}

interface HireRequestData {
  id: string;
  candidateName: string | null;
  email: string;
  companyName: string | null;
  roleType: string | null;
  salaryOffer?: string | null;
  location?: string | null;
  message: string;
  createdAt: Date;
}

export const sendInquiryNotification = async (
  inquiry: InquiryData
): Promise<void> => {
  const promises: Promise<void>[] = [];

  // Send Email
  if (config.email.resendApiKey) {
    promises.push(sendInquiryEmail(inquiry));
  }

  // Send Slack Notification
  if (config.slack.webhookUrl) {
    promises.push(sendInquirySlack(inquiry));
  }

  await Promise.allSettled(promises);
};

export const sendHireRequestNotification = async (
  request: HireRequestData
): Promise<void> => {
  const promises: Promise<void>[] = [];

  // Send Email
  if (config.email.resendApiKey) {
    promises.push(sendHireRequestEmail(request));
  }

  // Send Slack Notification
  if (config.slack.webhookUrl) {
    promises.push(sendHireRequestSlack(request));
  }

  await Promise.allSettled(promises);
};

async function sendInquiryEmail(inquiry: InquiryData): Promise<void> {
  try {
    const emailBody = `
      <h2>New Service Inquiry Received</h2>
      <p><strong>Client Name:</strong> ${inquiry.clientName}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Service Type:</strong> ${inquiry.serviceType || 'Not specified'}</p>
      <p><strong>Company:</strong> ${inquiry.companyName || 'Not specified'}</p>
      <p><strong>Phone:</strong> ${inquiry.phoneNumber || 'Not specified'}</p>
      <p><strong>Budget Range:</strong> ${inquiry.budgetRange || 'Not specified'}</p>
      <p><strong>Timeline:</strong> ${inquiry.timeline || 'Not specified'}</p>
      <p><strong>Project Details:</strong></p>
      <p>${inquiry.projectDetails || 'Not specified'}</p>
      <p><strong>Received:</strong> ${inquiry.createdAt.toLocaleString()}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.email.resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Portfolio <noreply@portfolio.com>',
        to: config.email.adminEmail,
        subject: `New Service Inquiry from ${inquiry.clientName}`,
        html: emailBody,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API responded with ${response.status}`);
    }

    logger.info('Inquiry email sent successfully', { inquiryId: inquiry.id });
  } catch (error) {
    logger.error('Failed to send inquiry email:', error);
    throw error;
  }
}

async function sendInquirySlack(inquiry: InquiryData): Promise<void> {
  try {
    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🆕 New Service Inquiry',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Client:*\n${inquiry.clientName}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${inquiry.email}`,
            },
            {
              type: 'mrkdwn',
              text: `*Service Type:*\n${inquiry.serviceType || 'Not specified'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Company:*\n${inquiry.companyName || 'Not specified'}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Budget:*\n${inquiry.budgetRange || 'Not specified'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Phone:*\n${inquiry.phoneNumber || 'Not specified'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Timeline:*\n${inquiry.timeline || 'Not specified'}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Project Details:*\n${inquiry.projectDetails || 'Not specified'}`,
          },
        },
      ],
    };

    const response = await fetch(config.slack.webhookUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API responded with ${response.status}`);
    }

    logger.info('Inquiry Slack notification sent', { inquiryId: inquiry.id });
  } catch (error) {
    logger.error('Failed to send inquiry Slack notification:', error);
    throw error;
  }
}

async function sendHireRequestEmail(request: HireRequestData): Promise<void> {
  try {
    const emailBody = `
      <h2>🚀 New Hire Request Received</h2>
      <p><strong>Candidate Name:</strong> ${request.candidateName || 'Not specified'}</p>
      <p><strong>Email:</strong> ${request.email}</p>
      <p><strong>Company:</strong> ${request.companyName || 'Not specified'}</p>
      <p><strong>Role Type:</strong> ${request.roleType || 'Not specified'}</p>
      <p><strong>Salary Offer:</strong> ${request.salaryOffer || 'Not specified'}</p>
      <p><strong>Location:</strong> ${request.location || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${request.message}</p>
      <p><strong>Received:</strong> ${request.createdAt.toLocaleString()}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.email.resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Portfolio <noreply@portfolio.com>',
        to: config.email.adminEmail,
        subject: `New Hire Request from ${request.candidateName || 'Candidate'} - ${request.companyName || 'Company'}`,
        html: emailBody,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API responded with ${response.status}`);
    }

    logger.info('Hire request email sent successfully', { requestId: request.id });
  } catch (error) {
    logger.error('Failed to send hire request email:', error);
    throw error;
  }
}

async function sendHireRequestSlack(request: HireRequestData): Promise<void> {
  try {
    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚀 New Hire Request',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Candidate:*\n${request.candidateName || 'Not specified'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${request.email}`,
            },
            {
              type: 'mrkdwn',
              text: `*Company:*\n${request.companyName || 'Not specified'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Role:*\n${request.roleType || 'Not specified'}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Salary Offer:*\n${request.salaryOffer || 'Not specified'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Location:*\n${request.location || 'Not specified'}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${request.message}`,
          },
        },
      ],
    };

    const response = await fetch(config.slack.webhookUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API responded with ${response.status}`);
    }

    logger.info('Hire request Slack notification sent', { requestId: request.id });
  } catch (error) {
    logger.error('Failed to send hire request Slack notification:', error);
    throw error;
  }
}

// =====================================================
// REPLY EMAIL FUNCTIONS
// =====================================================

interface ReplyEmailData {
  to: string;
  subject: string;
  message: string;
  clientName: string;
}

export const sendReplyEmail = async (data: ReplyEmailData): Promise<void> => {
  if (!config.email.resendApiKey) {
    throw new Error('Email service not configured');
  }

  try {
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${data.clientName},</p>
        <div style="margin: 20px 0; line-height: 1.6;">
          ${data.message.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #666; font-size: 12px;">
          This email was sent from your portfolio admin panel.
        </p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.email.resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Portfolio <${config.email.adminEmail}>`,
        to: data.to,
        subject: data.subject,
        html: emailBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Email API error: ${JSON.stringify(errorData)}`);
    }

    logger.info('Reply email sent successfully', { to: data.to });
  } catch (error) {
    logger.error('Failed to send reply email:', error);
    throw error;
  }
};
