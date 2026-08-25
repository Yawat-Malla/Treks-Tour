import { TripDetail } from "@/components/trip/TripDetail";

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TripDetail slug={slug} />;
}
