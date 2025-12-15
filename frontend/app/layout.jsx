import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Gostilna App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Toast notifications */}
        <Toaster position="top-right" />

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main className="p-6 max-w-4xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
