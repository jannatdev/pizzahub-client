
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  MapPin,
  Mail,
  Store,
} from "lucide-react";

export type MenuItem = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  vendorName: string;
  vendorEmail: string;
  status: "Pending" | "Approved" | "Rejected";
  isActive?: boolean;
  createdAt?: string;
};

type ManageMenuCardProps = {
  menu: MenuItem;
  processing: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
};

const manageMenuCard = ({
  menu,
  processing,
  onApprove,
  onReject,
  onDelete,
}: ManageMenuCardProps) => {

     const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
    return (
       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-5 p-4 sm:flex-row">
        {/* Menu Image */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-36 sm:w-40">
          {menu.imageUrl ? (
            <Image
              src={menu.imageUrl}
              alt={menu.itemName}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 160px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Menu Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                {menu.category}
              </p>

              <h3 className="mt-1 text-xl font-bold text-gray-900">
                {menu.itemName}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {menu.description}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusStyles[menu.status]
              }`}
            >
              {menu.status}
            </span>
          </div>

          <p className="mt-3 text-lg font-bold text-red-600">
            ৳{menu.price}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={15} />
              {menu.location}
            </span>

            <span className="flex items-center gap-1">
              <Store size={15} />
              {menu.vendorName}
            </span>

            <span className="flex items-center gap-1">
              <Mail size={15} />
              {menu.vendorEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-xs text-gray-500">
          Publisher: {menu.vendorName}
        </p>

        <div className="flex flex-wrap gap-2">
          {menu.status !== "Approved" && (
            <button
              type="button"
              disabled={processing}
              onClick={() => onApprove(menu._id)}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              Approve
            </button>
          )}

          {menu.status !== "Rejected" && (
            <button
              type="button"
              disabled={processing}
              onClick={() => onReject(menu._id)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={16} />
              Reject
            </button>
          )}

          <button
            type="button"
            disabled={processing}
            onClick={() => onDelete(menu._id)}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
    );
};

export default manageMenuCard;