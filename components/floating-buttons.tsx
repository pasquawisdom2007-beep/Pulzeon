"use client"

import { SITE } from "@/lib/site"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.41 1.3-1.94 1.34-.5.04-.98.24-3.29-.69-2.77-1.09-4.55-3.9-4.69-4.08-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.96-2.31.24-.27.53-.34.71-.34.18 0 .35 0 .51.01.16.01.38-.06.6.46.24.56.79 1.94.86 2.08.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.55.73 1.82.86.27.14.45.2.51.31.07.11.07.64-.17 1.32Z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M21.94 4.3 18.6 20.06c-.25 1.11-.91 1.38-1.85.86l-5.1-3.76-2.46 2.37c-.27.27-.5.5-1.02.5l.36-5.19 9.44-8.53c.41-.36-.09-.57-.63-.2L5.66 13.02.65 11.45c-1.09-.34-1.11-1.09.23-1.61L20.53 2.7c.91-.34 1.7.2 1.41 1.6Z" />
    </svg>
  )
}

export function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <a
        href={SITE.telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our Telegram channel"
        className="group flex items-center gap-2 rounded-full border border-neon-blue/50 bg-background/80 px-4 py-3 text-neon-cyan backdrop-blur shadow-neon-blue transition-all hover:scale-105 hover:shadow-neon-lg"
      >
        <TelegramIcon />
        <span className="hidden text-sm font-semibold sm:inline">Telegram</span>
      </a>
      <a
        href={SITE.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex items-center gap-2 rounded-full border border-neon-cyan/60 bg-background/80 px-4 py-3 text-neon-cyan backdrop-blur animate-pulse-glow transition-all hover:scale-105"
      >
        <WhatsAppIcon />
        <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
      </a>
    </div>
  )
}
