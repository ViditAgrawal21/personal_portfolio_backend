// Supabase Edge Function: Notify on New Hire Request
// Deploy: supabase functions deploy notify-hire-request

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SLACK_WEBHOOK_URL = Deno.env.get('SLACK_WEBHOOK_URL')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@portfolio.com'
const ADMIN_DASHBOARD_URL = Deno.env.get('ADMIN_DASHBOARD_URL') || 'http://localhost:3000'

interface HireRequestPayload {
  type: 'INSERT'
  table: string
  record: {
    id: string
    project_name: string
    tech_stack: string[]
    email: string
    message: string
    created_at: string
  }
}

serve(async (req) => {
  try {
    const payload: HireRequestPayload = await req.json()
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

async function sendEmailNotification(record: HireRequestPayload['record']) {
  const techStackList = record.tech_stack.join(', ')
  
  const emailBody = `
    <h2>🚀 New Hire Request Received</h2>
    <p><strong>Project Name:</strong> ${record.project_name}</p>
    <p><strong>Email:</strong> ${record.email}</p>
    <p><strong>Tech Stack:</strong> ${techStackList}</p>
    <p><strong>Message:</strong></p>
    <p>${record.message}</p>
    <p><strong>Received:</strong> ${new Date(record.created_at).toLocaleString()}</p>
    <hr>
    <p><a href="${ADMIN_DASHBOARD_URL}/hire-requests/${record.id}">View in Dashboard</a></p>
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
      subject: `New Hire Request: ${record.project_name}`,
      html: emailBody
    })
  })

  if (!response.ok) {
    throw new Error(`Email failed: ${response.statusText}`)
  }
}

async function sendSlackNotification(record: HireRequestPayload['record']) {
  const techStackList = record.tech_stack.map(tech => `\`${tech}\``).join(', ')
  
  const message = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚀 New Hire Request',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Project:*\n${record.project_name}`
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${record.email}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Tech Stack:*\n${techStackList}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n${record.message}`
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
            url: `${ADMIN_DASHBOARD_URL}/hire-requests/${record.id}`,
            style: 'primary'
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
