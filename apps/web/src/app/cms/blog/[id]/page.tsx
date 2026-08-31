import { CmsShell } from "@/components/cms/CmsShell";
import { BlogEditor } from "@/components/cms/BlogEditor";

export default async function CmsBlogEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <CmsShell>
      <BlogEditor id={id} />
    </CmsShell>
  );
}
