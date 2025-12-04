
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="">
          {children}
        </div>
      </body>
    </html>
  );
}
