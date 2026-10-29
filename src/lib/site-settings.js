// Only public information belongs here. Never put mail or AdSense credentials in this file.
export const siteName = "Pet Nutrition Guide";
export const siteUrl = "https://mycompanionpet.com";
export const editorialUrl = "/editorial-policy/";

const email = String(import.meta.env.PUBLIC_CONTACT_EMAIL || "rladbtls1224@gmail.com").trim();
if (email && !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}$/i.test(email)) {
  throw new Error("PUBLIC_CONTACT_EMAIL must be a valid public contact email address.");
}
export const contactEmail = email;
export const contactMailto = email
  ? `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}?subject=${encodeURIComponent("Pet Nutrition Guide 문의")}`
  : "";

// A publisher ID is public. An empty value keeps advertising verification disabled.
const client = String(import.meta.env.PUBLIC_ADSENSE_CLIENT || "").trim();
if (client && !/^ca-pub-\d{16}$/.test(client)) {
  throw new Error("PUBLIC_ADSENSE_CLIENT must use the ca-pub- followed by 16 digits format.");
}
export const adsenseClient = client;
