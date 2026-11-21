import EditMenuCard from "@/components/card/vendor/EditMenuCard";

/**
 * Edit a menu item (Phase 13 — menu management).
 *
 * Thin Server Component wrapper, same pattern as /menu/[id]: the shared
 * dashboard sidebar uses client URL hooks, so a dynamic `[id]` segment
 * needs `instant = false` to pass Cache Components static-shell
 * validation. The interactive form lives in EditMenuCard.
 */
export const instant = false;

export default async function EditMenuPage({
  params,
}: PageProps<"/dashboard/vendor/menu/EditMenu/[id]">) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Edit Menu Item
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update your item&apos;s details. Editing does not change its
          approval status.
        </p>
      </div>

      <EditMenuCard id={id} />
    </div>
  );
}
