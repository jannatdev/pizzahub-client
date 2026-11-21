import { MenuDetails } from "./_components/menu-details";

/**
 * Menu details page (Phase 12).
 *
 * The page itself is a thin Server Component wrapper: the shared Navbar uses
 * client URL/session hooks, and a dynamic `[id]` segment cannot be prerendered
 * statically with them — `instant = false` opts this route out of the Cache
 * Components static-shell validation (the interactive UI lives in the client
 * component next door).
 */
export const instant = false;

export default async function MenuDetailsPage({
  params,
}: PageProps<"/menu/[id]">) {
  const { id } = await params;

  return <MenuDetails id={id} />;
}
