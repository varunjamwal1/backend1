/**
 * Dynamically loads the Razorpay script only when it is needed (e.g., when the user clicks 'Pay').
 * This prevents Razorpay from loading 20+ JavaScript chunks immediately on page load,
 * thereby eliminating the 'preloaded using link preload but not used' warnings in Chrome DevTools
 * and significantly improving the initial page load speed.
 *
 * @returns {Promise<boolean>} Resolves to true if loaded successfully.
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // If already loaded, return immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script dynamically.");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
