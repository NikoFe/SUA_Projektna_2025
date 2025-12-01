import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Gostilna App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-6 max-w-4xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
