import { redirect } from "next/navigation";

/**
 * The menu details page lives at /menu/[id]. This keeps any existing
 * /browse-menu/[id] links working by redirecting to the new route.
 *
 * `instant = false`: the page only ever redirects, so it is allowed to
 * block (no static shell) — this opts it out of the Cache Components
 * static-shell validation that would otherwise fail the build.
 */
export const instant = false;

export default async function BrowseMenuDetailsRedirect({
  params,
}: PageProps<"/browse-menu/[id]">) {
  const { id } = await params;

  redirect(`/menu/${id}`);
}
