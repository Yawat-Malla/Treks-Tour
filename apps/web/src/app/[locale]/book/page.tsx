import { getLocale } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { BookingForm } from "@/components/BookingForm";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ trek?: string; trip?: string; kind?: string; date?: string; people?: string }>;
}) {
  const locale = await getLocale();
  const { trek, trip, kind, date, people } = await searchParams;
  const { trips } = await fetchPublic(locale);
  const n = people ? Number(people) : undefined;
  return (
    <BookingForm
      trips={trips}
      initialSlug={trip || trek}
      initialKind={kind}
      initialDate={date}
      initialPeople={n && Number.isFinite(n) ? n : undefined}
    />
  );
}
