import { Skeleton } from "@/components/ui/skeleton";

const MenuPageloading = () => {
    return (
        <div className="overflow-hidden rounded-xl border p-3">
      <Skeleton className="h-52 w-full rounded-lg" />

      <div className="space-y-3 p-2 pt-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
    );
};

export default MenuPageloading;