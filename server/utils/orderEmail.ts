import { SELLER, SELLER_ADDRESS } from "~/data/const";

/**
 * Email di conferma d'ordine al cliente.
 *
 * Vale come conferma del contratto su supporto durevole (Codice del Consumo,
 * art. 51 c. 7): oltre al riepilogo riporta l'identità del venditore e le
 * informazioni essenziali sul diritto di recesso, con il link alle condizioni
 * di vendita complete e al modulo.
 *
 * Solo tabelle e stili inline: è l'unico modo per avere la stessa resa in
 * Gmail, Outlook e sui client mobili.
 */
export type OrderEmailData = {
  orderNumber: string;
  createdAt: Date;
  customer: { name: string; surname: string; email: string; phone?: string };
  address: {
    street: string;
    city: string;
    zip: string;
    province?: string;
    country?: string;
  };
  shippingMethod: { name: string; priceCents: number };
  lines: Array<{
    name: string;
    quantity: number;
    unitPriceCents: number;
    condition?: string;
    language?: string;
    imageUrl?: string;
  }>;
  couponCode?: string | null;
  discountCents: number;
  totalCents: number;
};

const COLORS = {
  page: "#f3f1f7",
  card: "#ffffff",
  ink: "#16132a",
  muted: "#6b6880",
  line: "#e7e4ef",
  header: "#0b0f2e",
  pink: "#d9567a",
  soft: "#faf7fc",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const euro = (cents: number) =>
  (cents / 100).toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
  } as Intl.NumberFormatOptions);

const formatDate = (date: Date) =>
  date.toLocaleString("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const termsUrl = `${SELLER.website}/condizioni-di-vendita`;
const withdrawalUrl = `${termsUrl}#recesso`;

const totalRow = (label: string, value: string, strong = false) => `
  <tr>
    <td style="padding:6px 0;font-size:${strong ? 16 : 14}px;color:${strong ? COLORS.ink : COLORS.muted};${strong ? "font-weight:700;" : ""}">${escapeHtml(label)}</td>
    <td align="right" style="padding:6px 0;font-size:${strong ? 18 : 14}px;color:${COLORS.ink};font-weight:${strong ? 800 : 600};white-space:nowrap">${escapeHtml(value)}</td>
  </tr>`;

export function renderOrderConfirmationEmail(order: OrderEmailData) {
  const subtotalCents = order.lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.quantity,
    0,
  );
  const customerName = order.customer.name || "cliente";
  const when = formatDate(order.createdAt);
  const subject = `Conferma ordine ${order.orderNumber} · Jigglycard`;

  const lineRows = order.lines
    .map((line, index) => {
      const details = [line.condition, line.language ? line.language.toUpperCase() : ""]
        .filter(Boolean)
        .map(escapeHtml)
        .join(" · ");
      const image = line.imageUrl
        ? `<img src="${escapeHtml(line.imageUrl)}" width="44" alt="" style="display:block;width:44px;height:auto;border-radius:6px;border:1px solid ${COLORS.line}">`
        : "";
      return `<tr><td style="padding:12px 0;${index ? `border-top:1px solid ${COLORS.line};` : ""}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          ${image ? `<td width="56" valign="top">${image}</td>` : ""}
          <td valign="top" style="padding-right:10px">
            <div style="font-size:15px;font-weight:700;color:${COLORS.ink};line-height:1.3">${escapeHtml(line.name)}</div>
            ${details ? `<div style="font-size:12px;color:${COLORS.muted};margin-top:3px">${details}</div>` : ""}
            <div style="font-size:13px;color:${COLORS.muted};margin-top:4px">${line.quantity} × ${euro(line.unitPriceCents)}</div>
          </td>
          <td valign="top" align="right" width="1%" style="white-space:nowrap;font-size:14px;font-weight:700;color:${COLORS.ink}">${euro(line.unitPriceCents * line.quantity)}</td>
        </tr></table>
      </td></tr>`;
    })
    .join("");

  const cityLine = `${order.address.zip} ${order.address.city}${
    order.address.province ? ` (${order.address.province})` : ""
  }`.trim();
  const addressLines = [
    `${order.customer.name} ${order.customer.surname}`.trim(),
    order.address.street,
    cityLine,
    order.address.country && order.address.country !== "IT" ? order.address.country : "Italia",
    order.customer.phone ? `Tel. ${order.customer.phone}` : "",
  ].filter(Boolean);
  const address = addressLines
    .map(escapeHtml)
    .join("<br>");

  const html = `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.page}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Ordine ${escapeHtml(order.orderNumber)} confermato · totale ${euro(order.totalCents)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.page};font-family:${FONT}">
    <tr><td align="center" style="padding:20px 8px">
      <table role="presentation" align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:${COLORS.card};border-radius:16px;overflow:hidden">
        <tr><td style="background:${COLORS.header};padding:24px">
          <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#f4b6c6">Jigglycard</div>
          <div style="font-size:24px;font-weight:800;color:#ffffff;margin-top:6px;line-height:1.2">Grazie per il tuo ordine!</div>
          <div style="font-size:13px;color:#cbd5e1;margin-top:6px">Ordine <b style="color:#ffffff">${escapeHtml(order.orderNumber)}</b> · ${escapeHtml(when)}</div>
        </td></tr>

        <tr><td style="padding:22px 24px 0;font-size:15px;line-height:1.6;color:${COLORS.ink}">
          Ciao ${escapeHtml(customerName)}, abbiamo ricevuto il pagamento e il tuo ordine è confermato.
          Prepariamo la spedizione il prima possibile.
        </td></tr>

        <tr><td style="padding:22px 24px 4px;font-size:17px;font-weight:700;color:${COLORS.ink}">Riepilogo</td></tr>
        <tr><td style="padding:0 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${lineRows}</table>
        </td></tr>

        <tr><td style="padding:8px 24px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${COLORS.line}">
            ${totalRow("Subtotale", euro(subtotalCents))}
            ${order.discountCents > 0 ? totalRow(`Sconto${order.couponCode ? ` (${order.couponCode})` : ""}`, `−${euro(order.discountCents)}`) : ""}
            ${totalRow(`Spedizione · ${order.shippingMethod.name}`, order.shippingMethod.priceCents > 0 ? euro(order.shippingMethod.priceCents) : "Gratuita")}
            ${totalRow("Totale pagato", euro(order.totalCents), true)}
          </table>
        </td></tr>

        <tr><td style="padding:22px 24px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.soft};border:1px solid ${COLORS.line};border-radius:12px">
            <tr><td style="padding:16px 18px">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:${COLORS.muted}">Spedizione a</div>
              <div style="font-size:14px;line-height:1.6;color:${COLORS.ink};margin-top:6px">${address}</div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:22px 24px 0">
          <div style="font-size:15px;font-weight:700;color:${COLORS.ink}">Diritto di recesso</div>
          <div style="font-size:13px;line-height:1.6;color:${COLORS.muted};margin-top:6px">
            Puoi recedere dal contratto entro 14 giorni dalla consegna, senza indicarne il motivo,
            scrivendo a <a href="mailto:${SELLER.email}" style="color:${COLORS.pink}">${SELLER.email}</a>.
            Le spese di restituzione sono a tuo carico; ti rimborsiamo entro 14 giorni dal recesso.
            I prodotti hanno la garanzia legale di conformità di 24 mesi.
            Trovi tutte le condizioni e il modulo di recesso nelle
            <a href="${withdrawalUrl}" style="color:${COLORS.pink}">condizioni di vendita</a>.
          </div>
        </td></tr>

        <tr><td style="padding:22px 24px 0;font-size:13px;line-height:1.6;color:${COLORS.muted}">
          Per qualsiasi domanda rispondi a questa email o scrivici a
          <a href="mailto:${SELLER.email}" style="color:${COLORS.pink}">${SELLER.email}</a>
          (tel. ${escapeHtml(SELLER.phone)}), indicando il numero d'ordine.
        </td></tr>

        <tr><td style="height:24px"></td></tr>
        <tr><td style="padding:16px 24px 22px;font-size:12px;line-height:1.6;color:${COLORS.muted};border-top:1px solid ${COLORS.line}">
          ${escapeHtml(SELLER.name)} · ${escapeHtml(SELLER_ADDRESS)}<br>
          P.IVA ${escapeHtml(SELLER.vatNumber)} · <a href="${SELLER.website}" style="color:${COLORS.muted}">jigglycard.com</a> ·
          <a href="${termsUrl}" style="color:${COLORS.muted}">Condizioni di vendita</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Grazie per il tuo ordine, ${customerName}!`,
    `Ordine ${order.orderNumber} del ${when}: pagamento ricevuto, ordine confermato.`,
    "",
    "Riepilogo:",
    ...order.lines.map(
      (line) =>
        `- ${line.name}${line.condition ? ` (${line.condition}${line.language ? `, ${line.language.toUpperCase()}` : ""})` : ""}: ${line.quantity} x ${euro(line.unitPriceCents)}`,
    ),
    `Subtotale: ${euro(subtotalCents)}`,
    ...(order.discountCents > 0 ? [`Sconto: -${euro(order.discountCents)}`] : []),
    `Spedizione (${order.shippingMethod.name}): ${order.shippingMethod.priceCents > 0 ? euro(order.shippingMethod.priceCents) : "gratuita"}`,
    `Totale pagato: ${euro(order.totalCents)}`,
    "",
    "Spedizione a:",
    ...addressLines,
    "",
    "Diritto di recesso: puoi recedere entro 14 giorni dalla consegna senza indicarne il motivo,",
    `scrivendo a ${SELLER.email}. Condizioni complete e modulo: ${withdrawalUrl}`,
    "",
    `${SELLER.name} - ${SELLER_ADDRESS} - P.IVA ${SELLER.vatNumber}`,
  ].join("\n");

  return { subject, html, text };
}
