import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

export const metadata = {
  title: "TRIOW | Premium Apparel & Store",
  description: "Fabrilife inspired modern, clean ecommerce experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
