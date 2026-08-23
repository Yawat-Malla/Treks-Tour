import { CmsShell } from "@/components/cms/CmsShell";
import { TrekEditor } from "@/components/cms/TrekEditor";

export default async function CmsTrekEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <CmsShell>
      <TrekEditor id={id} />
    </CmsShell>
  );
}
