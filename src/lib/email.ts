import { Resend } from 'resend';

export async function sendOrderConfirmation(email: string, customerName: string, items: string[], total: string, sessionId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: 'La Mug Boutik <noreply@la-mug.com>',
    to: email,
    subject: `Confirmation de commande — La Mug Boutik'`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1A1610;color:white;padding:40px;border-radius:12px;">
        <h1 style="color:#C8A050;margin:0;">La Mug Boutik'</h1>
        <p style="color:rgba(255,255,255,0.5);margin-top:4px;">Confirmation de commande</p>
        <hr style="border:none;border-top:1px solid rgba(200,160,80,0.15);margin:24px 0;">
        <p>Bonjour ${customerName},</p>
        <p>Merci pour ta commande ! Voici le récapitulatif :</p>
        <ul style="color:rgba(255,255,255,0.7);">
          ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <p style="font-size:18px;font-weight:bold;color:#C8A050;">Total : ${total}</p>
        <p style="font-size:12px;color:rgba(255,255,255,0.3);">Réf: ${sessionId}</p>
        <hr style="border:none;border-top:1px solid rgba(200,160,80,0.15);margin:24px 0;">
        <p style="font-size:13px;color:rgba(255,255,255,0.4);">
          Si tu as acheté un album digital, tu recevras le lien de téléchargement dans un prochain email.<br>
          Pour toute question : contact@la-mug.com
        </p>
        <p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:24px;">Un projet — La M.U.G</p>
      </div>
    `,
  });
}
