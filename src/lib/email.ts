import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailTemplate = 'invitation' | 'invitation-revoked' | 'invitation-accepted';

const templates: Record<EmailTemplate, (data: any) => { subject: string; html: string }> = {
  invitation: ({ inviterName, agencyName, role, acceptUrl }) => ({
    subject: `Invitation to join ${agencyName}`,
    html: `
      <div>
        <h1>You've been invited to join ${agencyName}</h1>
        <p>${inviterName} has invited you to join ${agencyName} as a ${role.replace('_', ' ')}.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${acceptUrl}" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
          Accept Invitation
        </a>
        <p>This invitation link will expire in 7 days.</p>
      </div>
    `
  }),
  'invitation-revoked': ({ agencyName }) => ({
    subject: `Invitation to ${agencyName} has been revoked`,
    html: `
      <div>
        <h1>Invitation Revoked</h1>
        <p>The invitation to join ${agencyName} has been revoked.</p>
        <p>If you believe this was a mistake, please contact the agency administrator.</p>
      </div>
    `
  }),
  'invitation-accepted': ({ userName, agencyName, role }) => ({
    subject: `${userName} has accepted your invitation`,
    html: `
      <div>
        <h1>Invitation Accepted</h1>
        <p>${userName} has accepted your invitation to join ${agencyName} as a ${role.replace('_', ' ')}.</p>
      </div>
    `
  })
};

export async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: any
) {
  try {
    const { subject, html } = templates[template](data);
    
    const result = await resend.emails.send({
      from: 'Plura <noreply@plura.agency>',
      to,
      subject,
      html
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
