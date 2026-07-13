export const SITE = {
  name: "Pulzeon",
  tagline: "Premium Digital Products, Delivered Instantly",
  credit: "Powered by PASQUA TECH",
  whatsapp: "https://whatsapp.com/channel/0029VbCJho147XeEEuR1LA3s",
  telegram: "https://t.me/pasquamdsukuna",
  payment: {
    accountNumber: "9127857212",
    bank: "Opay",
    accountName: "Onuoha Paschal Chiagozie",
  },
  premium: {
    monthly: 2000,
    yearly: 20000,
    discountPercent: 20,
    vipWhatsapp: "https://whatsapp.com/channel/0029VbCJho147XeEEuR1LA3s",
    vipTelegram: "https://t.me/pasquamdsukuna",
  },
}

export const CATEGORIES = [
  "CV & Resume",
  "Business",
  "Design",
  "Past Questions",
  "Productivity",
  "Source Code",
  "eBooks",
  "Templates",
] as const

export function formatNaira(amount: number): string {
  return "\u20A6" + amount.toLocaleString("en-NG")
}
