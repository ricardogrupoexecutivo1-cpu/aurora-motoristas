import "./globals.css";

export const metadata = {
  title: "Aurora Motoristas",
  description: "Plataforma nacional de mobilidade e operações",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                fetch('/api/access-log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    path: window.location.pathname,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent
                  })
                });
              } catch (e) {}
            `,
          }}
        />
      </body>
    </html>
  );
}
