import type { OfferEmailPayload } from '@/types'

const WEBHOOK_URL = import.meta.env.VITE_APP_GAS_WEBHOOK_URL as string

export async function sendOfferEmail(payload: OfferEmailPayload): Promise<{ success: boolean }> {
  if (!WEBHOOK_URL) {
    throw new Error('Google Apps Script webhook URL is not configured')
  }

  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    mode: 'no-cors',
  })

  // Google Apps Script with no-cors returns opaque response
  // We consider it successful if no network error was thrown
  return { success: true }
}
