import { ListingPage } from "@/components/trip/ListingPage";
import { listingMetadata } from "@/lib/page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return listingMetadata(locale, "safari");
}

export default function SafarisPage() {
  return <ListingPage kind="safari" />;
}
