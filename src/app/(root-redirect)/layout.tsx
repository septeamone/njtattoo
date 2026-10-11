import { fontVariables } from "@/fonts";
import "../globals.css";

// Second root layout: serves only "/" (static export cannot use proxy redirects).
export default function RootRedirectLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
