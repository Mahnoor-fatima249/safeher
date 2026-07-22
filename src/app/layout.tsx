import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeHer - Safety Ecosystem",
  description: "Your personal safety ecosystem, active and monitoring.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased flex justify-center items-center">
        {/* Mobile App Container Wrapper */}
        <div className="w-full max-w-md min-h-screen sm:min-h-[85vh] sm:rounded-3xl bg-slate-900 shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}