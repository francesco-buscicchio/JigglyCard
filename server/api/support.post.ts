import { createError, readBody } from "h3";
import { sendShopMail } from "~/server/utils/mailer";
import { assertRateLimit } from "~/server/utils/rateLimit";

/**
 * Modulo di assistenza: inoltra il messaggio alla casella del negozio.
 *
 * Sostituisce la vecchia rotta SendGrid, che spediva qualunque email il
 * browser le passasse (mittente, destinatario e HTML compresi). Qui mittente e
 * destinatario sono fissi; il cliente compare solo come "rispondi a", e il
 * suo testo viaggia come testo semplice.
 */

const LIMITS = { name: 80, email: 160, phone: 30, message: 5000 };

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event).catch(() => ({}));

  // Campo nascosto: lo compilano solo i bot. Si risponde come se fosse andato
  // a buon fine, per non dare indizi.
  if (String(body?.website ?? "").trim()) return { ok: true };

  const name = String(body?.name ?? "").trim().slice(0, LIMITS.name);
  const surname = String(body?.surname ?? "").trim().slice(0, LIMITS.name);
  const email = String(body?.email ?? "").trim().slice(0, LIMITS.email);
  const phone = String(body?.phone ?? "").trim().slice(0, LIMITS.phone);
  const message = String(body?.message ?? "").trim().slice(0, LIMITS.message);
  // Il modulo di "Chi siamo" chiede un solo campo per il nome: il cognome è
  // obbligatorio solo dove il modulo lo prevede.
  const source = body?.source === "chi-siamo" ? "chi-siamo" : "assistenza";

  if (
    !name ||
    (source === "assistenza" && !surname) ||
    !message ||
    !isValidEmail(email)
  ) {
    throw createError({ statusCode: 400, statusMessage: "Compila tutti i campi" });
  }

  assertRateLimit(event, "support", {
    max: 5,
    windowMs: 10 * 60 * 1000,
    message: "Troppi messaggi inviati, riprova più tardi",
  });

  const shopMail = String(useRuntimeConfig(event).public.ADMIN_MAIL ?? "");
  if (!shopMail) {
    throw createError({ statusCode: 503, statusMessage: "Casella del negozio non configurata" });
  }

  const fullName = `${name} ${surname}`.trim();
  const origin = source === "chi-siamo" ? "modulo di contatto" : "modulo di assistenza";
  const phoneLine = phone ? `\nTelefono: ${phone}` : "";
  await sendShopMail(event, {
    to: shopMail,
    replyTo: email,
    subject: `${source === "chi-siamo" ? "Contatto" : "Assistenza"} dal sito: ${fullName}`,
    text: `Messaggio dal ${origin}.\n\nDa: ${fullName} <${email}>${phoneLine}\n\n${message}`,
    html:
      `<p>Messaggio dal ${origin}.</p>` +
      `<p><b>Da:</b> ${escapeHtml(fullName)} &lt;${escapeHtml(email)}&gt;</p>` +
      (phone ? `<p><b>Telefono:</b> ${escapeHtml(phone)}</p>` : "") +
      `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });

  return { ok: true };
});
