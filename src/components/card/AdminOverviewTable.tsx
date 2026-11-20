"use client";

import {
  Users,
  Store,
  UserRound,
  UtensilsCrossed,
  Clock3,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
}

interface AdminOverviewTableProps {
  stats: AdminStats;
}


const AdminOverviewTable = ({
  stats,
}: AdminOverviewTableProps) => {

    const overviewData = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers,
      description: "All registered users",
      icon: Users,
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      description: "Registered vendors",
      icon: Store,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      description: "Registered customers",
      icon: UserRound,
    },
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      description: "All menu items",
      icon: UtensilsCrossed,
    },
    {
      title: "Pending Menu Items",
      value: stats.pendingMenuItems,
      description: "Waiting for approval",
      icon: Clock3,
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      description: "All transactions",
      icon: CreditCard,
    },
  ];
    return (
        <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">
          Dashboard Overview
        </CardTitle>

        <CardDescription>
          Summary of users, vendors, menus and transactions.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-6">Overview</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="pr-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {overviewData.map((item) => {
                const Icon = item.icon;

                return (
                  <TableRow
                    key={item.title}
                    className="transition-colors hover:bg-red-50/50"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                          <Icon className="h-4 w-4" />
                        </div>

                        <span className="font-medium">
                          {item.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {item.description}
                    </TableCell>

                    <TableCell className="text-right">
                      <span className="font-semibold">
                        {item.value.toLocaleString()}
                      </span>
                    </TableCell>

                    <TableCell className="pr-6 text-right">
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-600"
                      >
                        Available
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    );
};

export default AdminOverviewTable;