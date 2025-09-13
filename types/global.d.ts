export {}

declare global {
  interface Window {
    confirmAge21?: () => void
    tryInitAnalytics?: () => void
  }
}

