import { TripDetail } from "@/components/trip/TripDetail";

export default async function RaftingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TripDetail slug={slug} />;
}
