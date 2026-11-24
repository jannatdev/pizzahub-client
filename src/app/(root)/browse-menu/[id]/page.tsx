import { redirect } from "next/navigation";


export const instant = false;

export default async function BrowseMenuDetailsRedirect({
  params,
}: PageProps<"/browse-menu/[id]">) {
  const { id } = await params;

  redirect(`/menu/${id}`);
}
