import ScreenPageClient from "./ScreenPageClient";

// Generate static params for the export
// The app will handle routing client-side
export async function generateStaticParams() {
  // Just generate a few placeholder routes for static export
  return [{ screen: "10" }];
}

export default function ScreenPage() {
  return <ScreenPageClient />;
}
