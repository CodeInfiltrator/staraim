export type Locale = "en" | "id";

export const dictionaries = {
  en: {
    home: "Home",
    how: "How it works",
    watch: "Watch",
    live: "Live sky",
    catalogue: "Catalogue",
    explorers: "Sky explorers",
    openSky: "Open the sky",
    getApp: "Get app",
    pages: "Pages",
    founders: "Founders",
    followUs: "Follow Us",
    language: "Language",
  },
  id: {
    home: "Beranda",
    how: "Cara Kerja",
    watch: "Jam Tangan",
    live: "Langit Langsung",
    catalogue: "Katalog",
    explorers: "Penjelajah Langit",
    openSky: "Buka Langit",
    getApp: "Unduh Aplikasi",
    pages: "Halaman",
    founders: "Pendiri",
    followUs: "Ikuti Kami",
    language: "Bahasa",
  },
};

export function getDictionary(lang: Locale) {
  return dictionaries[lang];
}
