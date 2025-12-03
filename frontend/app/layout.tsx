import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Gostilna App",
  description: "Projektna naloga SUA",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="sl">
      <body>
        <Navbar />
        <main className="p-8 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
