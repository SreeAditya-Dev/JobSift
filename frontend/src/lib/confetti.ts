/**
 * Safe client-side confetti launcher for Next.js
 * Completely resilient against Webpack/Turbopack CJS/ESM module resolution differences.
 */
export async function fireConfetti(options: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = (confettiModule as any).default || confettiModule;

    if (typeof confetti === 'function') {
      confetti(options);
    }
  } catch (error) {
    console.warn('Unable to fire celebratory confetti:', error);
  }
}
