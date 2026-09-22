import { CmsShell } from "@/components/cms/CmsShell";
import { TrekEditor } from "@/components/cms/TrekEditor";

export default async function CmsRideEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <CmsShell>
      <TrekEditor id={id} forceKind="ride" />
    </CmsShell>
  );
}
