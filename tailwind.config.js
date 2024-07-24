/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
					background: 'hsl(var(--secondary-background) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			typography: () => ({
				theme: {
					css: {
						'--tw-prose-body': 'hsl(var(--foreground) / 0.9)',
						'--tw-prose-headings': 'hsl(var(--foreground) / 1)',
						'--tw-prose-lead': 'hsl(var(--foreground) / 0.9)',
						'--tw-prose-links': 'hsl(var(--primary) / 1)',
						'--tw-prose-bold': 'hsl(var(--foreground) / 1)',
						'--tw-prose-counters': 'hsl(var(--foreground) / 0.3)',
						'--tw-prose-bullets': 'hsl(var(--foreground) / 0.3)',
						'--tw-prose-hr': 'hsl(var(--border) / 1)',
						'--tw-prose-quotes': 'hsl(var(--foreground) / 0.9)',
						'--tw-prose-quote-borders': 'hsl(var(--border) / 1)',
						'--tw-prose-captions': 'hsl(var(--foreground) / 0.6)',
						'--tw-prose-code': 'hsl(var(--foreground) / 1)',
						'--tw-prose-pre-code': 'hsl(var(--foreground) / 1)',
						'--tw-prose-pre-bg': 'hsl(var(--background) / 1)',
						'--tw-prose-th-borders': 'hsl(var(--border) / 1)',
						'--tw-prose-td-borders': 'hsl(var(--border) / 1)'
					}
				}
			})
		}
	},
	plugins: []
};
