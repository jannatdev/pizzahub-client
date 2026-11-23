import { Users } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";
import AdminUsersTable from "@/components/card/admin/adminUsersTable";

export default function ManageUsersPage() {
  return (
    <div className="bg-red-50/25 py-10 px-5 rounded-2xl">

      <div className="bg-red-50/25">
         <PagePlaceholder
      icon={Users}
      title="Manage Users"
      description="Search, filter, block and unblock customers and vendors."
      
    />

      </div>
      

        <div className="space-y-6 p-6 ">
      {/* Header */}
      <div >
        <h1 className="text-2xl text-black font-bold tracking-tight">
          Manage Users
        </h1>

        <p className="mt-1 text-muted-foreground">
          View and manage all PizzaHub users.
        </p>
      </div>

      {/* Users Table */}
      <AdminUsersTable />
    </div>

    </div>
   
  );
}
  