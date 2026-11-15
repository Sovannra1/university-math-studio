import { Battambang, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "mafs/core.css";
import "./globals.css";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import LoginModal from "@/components/auth/LoginModal";

const battambang = Battambang({
  variable: "--font-battambang",
  subsets: ["khmer", "latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "គណិតវិទ្យាសាកលវិទ្យាល័យ | University Mathematics Interactive",
  description:
    "កម្មវិធីសិក្សាគណិតវិទ្យាកម្រិតសាកលវិទ្យាល័យអន្តរកម្ម (Calculus, Real Analysis, Algebra, Topology)",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="km"
      suppressHydrationWarning
      className={`${battambang.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fffafa] text-[#160002] font-sans selection:bg-[#ffd3d2] selection:text-[#620116]">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <LoginModal />
            <ScrollToTopButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
