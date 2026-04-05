export const metadata = {
  title: 'Hotel Guest Services',
  description: 'Guest appreciation and digital tipping',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
