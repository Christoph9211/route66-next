export {}

declare global {
  interface Window {
    confirmAge21?: () => void
    tryInitAnalytics?: () => void
    __next_script_nonce__?: string
  }
}

