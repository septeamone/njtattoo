// Contacts as given by the artist. WhatsApp and KakaoTalk use the same phone number.
// wa.me wants the number in international form without "+" and without the leading trunk 0 (010 -> 10).
export const contacts = {
  phone: "+82 10 8389 8701",
  tel: "tel:+821083898701",
  whatsapp: "https://wa.me/821083898701",
  telegram: "https://t.me/NJAndrei",
  telegramHandle: "@NJAndrei",
  instagram: "https://www.instagram.com/nj.tattoo_/",
  instagramHandle: "@nj.tattoo_",
  // KakaoTalk has no link that opens a chat from a phone number. Put the artist's open-chat or channel link here
  // (https://open.kakao.com/o/... or https://pf.kakao.com/_...) and the KakaoTalk row becomes a live link.
  kakao: null as string | null,
};
