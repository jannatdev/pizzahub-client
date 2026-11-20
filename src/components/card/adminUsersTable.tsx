"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, Search, Users } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";

import { getAllPublicMenus } from "@/lib/api/browseMenu";
import { Menu } from "@/type/menu";
import { getAllUsers } from "@/lib/api/admin/adminUser";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "customer" | "vendor" | "admin";
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
export const AdminUsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  

  const [page, setPage] = useState(1);
  

  const [pagination, setPagination] = useState({
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [category, setCategory] = useState<string>("all");

  const [limit, setLimit] = useState(10);

const fetchUsers = async () => {
  try {
    setLoading(true);

    const data = await getAllUsers({
      page,
      limit,
      search: search.trim(),
      role,
    });

    setUsers(data.users);
    setPagination(data.pagination);
  } catch (error) {
    console.error("Fetch users error:", error);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  let ignore = false;

  const loadUsers = async () => {
    try {
      const data = await getAllUsers({
        page,
        limit,
        search: search.trim(),
        role,
      });

      if (!ignore) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      if (!ignore) {
        console.error("Fetch users error:", error);
        setUsers([]);
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadUsers();

  return () => {
    ignore = true;
  };
}, [page, limit, search, role]);

const handleSearch = (value: string) => {
  setSearch(value);
  setPage(1);
};

const handleCategoryChange = (value: string | null) => {
  setCategory(value ?? "all");
};

const getRoleBadge = (userRole: User["role"]) => {
  if (userRole === "admin") {
    return (
      <Badge variant="destructive">
        Admin
      </Badge>
    );
  }

  if (userRole === "vendor") {
    return (
      <Badge className="bg-orange-500 hover:bg-orange-500">
        Vendor
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      Customer
    </Badge>
  );
};

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
    return (
         <div className="space-y-5">
      {/* Search and Filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Role Filter */}
        <Select
          value={role}
           onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Roles
            </SelectItem>

            <SelectItem value="customer">
              Customer
            </SelectItem>

            <SelectItem value="vendor">
              Vendor
            </SelectItem>

            <SelectItem value="admin">
              Admin
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />

                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>

                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>

                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>

                    <TableCell>
                      <Skeleton className="ml-auto h-9 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-10 w-10 text-muted-foreground" />

                    <p className="font-medium">
                      No users found
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Try changing your search or filter.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  {/* User */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-medium">
                          {user.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          ID: {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <span className="text-sm">
                      {user.email}
                    </span>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>

                  {/* Joined */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </span>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {(pagination.currentPage - 1) * pagination.limit + 1}
            {" - "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalUsers
            )}{" "}
            of {pagination.totalUsers} users
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <div className="rounded-md border px-3 py-1.5 text-sm">
              {pagination.currentPage} /{" "}
              {pagination.totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={
                page >= pagination.totalPages
              }
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              User Details
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5">
              {/* Profile */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
                  {selectedUser.image ? (
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
                      {selectedUser.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="font-semibold">
                    {selectedUser.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>

                {getRoleBadge(selectedUser.role)}
              </div>

              {/* Details */}
              <div className="rounded-lg border">
                <div className="flex justify-between border-b px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    User ID
                  </span>

                  <span className="max-w-[200px] truncate text-sm font-medium">
                    {selectedUser.id}
                  </span>
                </div>

                <div className="flex justify-between border-b px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    Email
                  </span>

                  <span className="max-w-[200px] truncate text-sm font-medium">
                    {selectedUser.email}
                  </span>
                </div>

                <div className="flex justify-between px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    Joined
                  </span>

                  <span className="text-sm font-medium">
                    {formatDate(
                      selectedUser.createdAt
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    );
};

export default AdminUsersTable;