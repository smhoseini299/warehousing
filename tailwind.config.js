/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Vazirmatn', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
  // Enable RTL support
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Optional: If you want to force RTL layout
  // You can also add dir="rtl" to your HTML tag
  // or use className="rtl" on parent divs
  variants: {
    extend: {
      textAlign: ['rtl'],
    }
  }
}
