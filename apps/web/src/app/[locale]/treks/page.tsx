import { ListingPage } from "@/components/trip/ListingPage";
import { listingMetadata } from "@/lib/page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return listingMetadata(locale, "trek");
}

export default function TreksPage() {
  return <ListingPage kind="trek" />;
}
