import nodemailer, { type Transporter } from "nodemailer";
import { createError, type H3Event } from "h3";

let transporter: Transporter | null = null;

/**
 * Invio email dalla casella Aruba del negozio (conferme d'ordine, messaggi di
 * assistenza). Le credenziali restano lato server: il browser non sceglie mai
 * mittente né destinatario, sono le rotte del sito a deciderli.
 */
function getTransporter(event: H3Event) {
  if (transporter) return transporter;

  const config = useRuntimeConfig(event);
  const host = String(config.SMTP_HOST ?? "");
  const user = String(config.SMTP_USER ?? "");
  const pass = String(config.SMTP_PASS ?? "");
  if (!host || !user || !pass) {
    throw createError({
      statusCode: 503,
      statusMessage: "Configurazione email mancante: impostare SMTP_HOST, SMTP_USER e SMTP_PASS",
    });
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(config.SMTP_PORT) || 465,
    secure: String(config.SMTP_SECURE ?? "true") !== "false",
    auth: { user, pass },
  });
  return transporter;
}

export async function sendShopMail(
  event: H3Event,
  message: {
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
    bcc?: string;
  },
) {
  const config = useRuntimeConfig(event);
  const from = String(config.MAIL_FROM || config.SMTP_USER || "");
  return getTransporter(event).sendMail({ from, ...message });
}
