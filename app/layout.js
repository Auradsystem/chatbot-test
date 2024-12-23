export const metadata = {
  title: "Chatbot Test",
  description: "Test Chatbot avec Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
