import { CmsShell } from "@/components/cms/CmsShell";
import { TrekList } from "@/components/cms/TrekList";

export default function CmsRides() {
  return (
    <CmsShell>
      <TrekList forceKind="ride" />
    </CmsShell>
  );
}
