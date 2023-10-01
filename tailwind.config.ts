import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode:'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      transitionDelay:{
        '1500':'1500ms'
      },
      colors:{
        bg:'#edede9',
        text:'#1f1f1f',
        bgDark:'#1f1f1f',
        textDark:'#edede9'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes:{
        scaleUp:{
          '0%':{scale:'0'},
          '90%':{scale:'1.1'},
          '100%':{scale:'1'}
        },
        scaleUpWord:{
          '0%':{scale:'0'},
          '100%':{scale:'1'},
        },
        "accordion-down": {
          from: { height: '0' },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: '0' },
        },
        "foldIn":{
          '0%':{scale:'1'},
          '100%':{scale:'0'},
        }
      },
      animation:{
        'scaleUp':'scaleUp 0.5s ease',
        'scaleUpWord':'scaleUpWord 0.5s ease forwards',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'scaleDownWord':'foldIn 0.5s ease forwards'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
