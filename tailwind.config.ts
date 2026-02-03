import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        cyber: {
          cyan: "hsl(var(--cyber-cyan))",
          "cyan-glow": "hsl(var(--cyber-cyan-glow))",
          red: "hsl(var(--cyber-red))",
          "red-glow": "hsl(var(--cyber-red-glow))",
          orange: "hsl(var(--cyber-orange))",
          "orange-glow": "hsl(var(--cyber-orange-glow))",
          amber: "hsl(var(--cyber-amber))",
          green: "hsl(var(--cyber-green))",
          purple: "hsl(var(--cyber-purple))",
          surface: "hsl(var(--cyber-bg-surface))",
          elevated: "hsl(var(--cyber-bg-elevated))",
          deep: "hsl(var(--cyber-bg-deep))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "1",
            boxShadow: "0 0 20px hsl(var(--cyber-cyan) / 0.3)"
          },
          "50%": { 
            opacity: "0.8",
            boxShadow: "0 0 40px hsl(var(--cyber-cyan) / 0.5)"
          },
        },
        "node-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "node-float": "node-float 4s ease-in-out infinite",
        "border-flow": "border-flow 3s linear infinite",
      },
      backgroundImage: {
        "cyber-gradient": "var(--gradient-cyber)",
        "card-gradient": "var(--gradient-card)",
        "hero-gradient": "var(--gradient-hero)",
      },
      boxShadow: {
        "glow-cyan": "var(--shadow-glow-cyan)",
        "glow-red": "var(--shadow-glow-red)",
        "cyber-card": "var(--shadow-card)",
        "cyber-elevated": "var(--shadow-elevated)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
