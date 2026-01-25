// Supabase Edge Function: Notify on New Inquiry
// Deploy: supabase functions deploy notify-inquiry

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SLACK_WEBHOOK_URL = Deno.env.get('SLACK_WEBHOOK_URL')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@portfolio.com'
const ADMIN_DASHBOARD_URL = Deno.env.get('ADMIN_DASHBOARD_URL') || 'http://localhost:3000'

interface InquiryPayload {
  type: 'INSERT'
  table: string
  record: {
    id: string
    client_name: string
    email: string
    service_type: string
    budget_range?: string
    requirements: string
    created_at: string
  }
}

serve(async (req) => {
  try {
    const payload: InquiryPayload = await req.json()
    const { record } = payload

    // Send Email Notification via Resend
    if (RESEND_API_KEY) {
      await sendEmailNotification(record)
    }

    // Send Slack Notification
    if (SLACK_WEBHOOK_URL) {
      await sendSlackNotification(record)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error sending notifications:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function sendEmailNotification(record: InquiryPayload['record']) {
  const emailBody = `
    <h2>New Service Inquiry Received</h2>
    <p><strong>Client Name:</strong> ${record.client_name}</p>
    <p><strong>Email:</strong> ${record.email}</p>
    <p><strong>Service Type:</strong> ${record.service_type}</p>
    <p><strong>Budget Range:</strong> ${record.budget_range || 'Not specified'}</p>
    <p><strong>Requirements:</strong></p>
    <p>${record.requirements}</p>
    <p><strong>Received:</strong> ${new Date(record.created_at).toLocaleString()}</p>
    <hr>
    <p><a href="${ADMIN_DASHBOARD_URL}/inquiries/${record.id}">View in Dashboard</a></p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Portfolio <noreply@portfolio.com>',
      to: ADMIN_EMAIL,
      subject: `New Service Inquiry from ${record.client_name}`,
      html: emailBody
    })
  })

  if (!response.ok) {
    throw new Error(`Email failed: ${response.statusText}`)
  }
}

async function sendSlackNotification(record: InquiryPayload['record']) {
  const message = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🆕 New Service Inquiry',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Client:*\n${record.client_name}`
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${record.email}`
          },
          {
            type: 'mrkdwn',
            text: `*Service:*\n${record.service_type}`
          },
          {
            type: 'mrkdwn',
            text: `*Budget:*\n${record.budget_range || 'Not specified'}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Requirements:*\n${record.requirements}`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View in Dashboard'
            },
            url: `${ADMIN_DASHBOARD_URL}/inquiries/${record.id}`
          }
        ]
      }
    ]
  }

  const response = await fetch(SLACK_WEBHOOK_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })

  if (!response.ok) {
    throw new Error(`Slack notification failed: ${response.statusText}`)
  }
}
