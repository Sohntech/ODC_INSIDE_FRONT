import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sonatel Academy',
  description: 'Plateforme de gestion de Sonatel Academy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang="fr" suppressHydrationWarning>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
          <style>
            {`
              .bg-sonatel-orange { background-color: #F16E00; }
              .text-sonatel-orange { color: #F16E00; }
              .border-sonatel-orange { border-color: #F16E00; }
              .bg-sonatel-teal { background-color: #009682; }
              .text-sonatel-teal { color: #009682; }
              .border-sonatel-teal { border-color: #009682; }
            `}
          </style>
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="sonatel-theme"
          >
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}