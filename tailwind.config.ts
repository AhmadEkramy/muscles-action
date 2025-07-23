import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: '#b0b0b0',
				input: '#f6f6f6',
				ring: '#888888',
				background: '#f6f6f6',
				foreground: '#000',
				primary: {
					DEFAULT: '#4f4f4f',
					foreground: '#f6f6f6',
				},
				secondary: {
					DEFAULT: '#888888',
					foreground: '#f6f6f6',
				},
				accent: {
					DEFAULT: '#b0b0b0',
					foreground: '#f6f6f6',
				},
				muted: {
					DEFAULT: '#f6f6f6',
					foreground: '#888888',
				},
				card: {
					DEFAULT: '#f6f6f6',
					foreground: '#000',
				},
				popover: {
					DEFAULT: '#f6f6f6',
					foreground: '#000',
				},
				destructive: {
					DEFAULT: '#000',
					foreground: '#f6f6f6',
				},
				brand: {
					lightest: '#f6f6f6',
					lighter: '#e7e7e7',
					light: '#d1d1d1',
					medium: '#b0b0b0',
					gray: '#888888',
					dark: '#6d6d6d',
					darker: '#5d5d5d',
					darkest: '#4f4f4f',
					deep: '#454545',
					deeper: '#3d3d3d',
					black: '#000000',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--elite-primary) / 0.4)'
					},
					'50%': {
						boxShadow: '0 0 30px hsl(var(--elite-primary) / 0.8)'
					}
				},
				'slide-up': {
					from: {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-bounce': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out',
				'scale-bounce': 'scale-bounce 0.3s ease-out'
			},
			backgroundImage: {
				'gradient-elite': 'var(--gradient-primary)',
				'gradient-glow': 'var(--gradient-glow)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'hover': 'var(--shadow-hover)',
				'card': 'var(--shadow-card)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
