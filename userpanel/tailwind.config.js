/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        offwhite: "var(--offwhite)",
        baseblack: "var(--baseblack)",
        basegray: "var(--basegray)",
        alabaster: "var(--alabaster)",
        black_opacity_10: "var(--black_opacity_10)",
        "gray-66": "var(--gray-66)",
        "gray-c8": "var(--gray-c8)",
        "gray-lightest": "var(--gray-lightest)",
        "gray-e2": "var(--gray-e2)",
        grayborder: "var(--grayborder)",
        isabelline: "var(--isabelline)",
        whitesmoke: "var(--whitesmoke)",
        lightblack: "var(--lightblack)",
      },
      imageRendering: {
        pixelated: "pixelated",
        crisp: "crisp-edges",
        optimize: "-webkit-optimize-contrast",
      },
    },
    fontFamily: {
      castoro: ["Castoro", "sans-serif"],
    },
    animation: {
      "fade-in": "fadeIn 2s linear infinite",
      marquee: "marquee 20s linear infinite",
      enter: "enterAnim 0.5s ease-out forwards",
    },
    marquee: {
      from: { transform: "translateX(0)" },
      to: { transform: "translateX(-75%)" },
    },
    keyframes: {
      enterAnim: {
        "0%": { opacity: "0", transform: "translateY(24px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      fadeIn: {
        "0%, 100%": { opacity: 0.25 },
        "50%": { opacity: 1 },
      },
    },

    screens: {
      xxs: "320px",
      xss: "400px",
      xs: "576px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
      "2xl": "1440px",
      "3xl": "1536px",
      "4xl": "1740px",
      "5xl": "1920px",
      "6xl": "2200px",
    },
    // container: {
    //   center: true,
    //   margin: "0 auto",
    //   padding: "1rem",
    //   screens: {
    //     xxs: "310px",
    //     xss: "380px",
    //     xs: "546px",
    //     sm: "620px",
    //     md: "718px",
    //     lg: "992px",
    //     xl: "1180px",
    //     "2xl": "1420px",
    //     // "3xl": "1516px",
    //     "4xl": "1700px",
    //   },
    // },
  },

  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".image-rendering-pixelated": {
          imageRendering: "pixelated",
        },
        ".image-rendering-crisp": {
          imageRendering: "crisp-edges",
        },
        ".image-rendering-optimize": {
          imageRendering: "-webkit-optimize-contrast",
        },
      });
    },
  ],
};
