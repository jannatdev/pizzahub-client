
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Button } from "@/components/ui/button";
import {
  Utensils,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Crown,
  ArrowUpRight,
} from "lucide-react";

const overviewData = [
  {
    title: "Total Menu Items",
    value: 24,
    description: "Total items in your menu",
    icon: Utensils,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
  },
  {
    title: "Active Menu Items",
    value: 18,
    description: "Currently available",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
  {
    title: "Pending Orders",
    value: 7,
    description: "Waiting for your response",
    icon: Clock,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  {
    title: "Accepted Orders",
    value: 12,
    description: "Orders you have accepted",
    icon: ShoppingBag,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
];

const recentOrders = [
  {
    id: "ORD-1001",
    customer: "Rahim Ahmed",
    item: "Chicken Pizza",
    amount: "৳850",
    status: "Pending",
  },
  {
    id: "ORD-1002",
    customer: "Nusrat Jahan",
    item: "Cheese Pizza",
    amount: "৳650",
    status: "Accepted",
  },
  {
    id: "ORD-1003",
    customer: "Sakib Hasan",
    item: "Beef Burger",
    amount: "৳420",
    status: "Accepted",
  },
  {
    id: "ORD-1004",
    customer: "Ayesha Rahman",
    item: "Pepperoni Pizza",
    amount: "৳950",
    status: "Pending",
  },
];

export default function VendorOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50/70 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here&apos;s what&apos;s happening with your restaurant.
            </p>
          </div>

          <Button className="bg-red-600 hover:bg-red-700">
            <Utensils className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewData.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {item.title}
                  </CardTitle>

                  <div className={`rounded-lg p-2 ${item.iconBg}`}>
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl font-bold tracking-tight text-gray-900">
                    {item.value}
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Subscription Plan */}
        <Card className="overflow-hidden rounded-xl border-red-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 bg-gradient-to-r from-red-50 via-white to-white p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-red-100 p-3">
                <Crown className="h-6 w-6 text-red-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Current Subscription
                </p>
                <h2 className="text-xl font-bold text-gray-900">
                  Free Plan
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  You can add up to 3 menu items for free.
                </p>
              </div>
            </div>

            <Button className="bg-red-600 hover:bg-red-700">
              Upgrade Plan
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Recent Orders Table */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Recent Orders
              </CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Manage your latest customer orders.
              </p>
            </div>

            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              View All
            </Button>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id}
                      </TableCell>

                      <TableCell>{order.customer}</TableCell>

                      <TableCell>{order.item}</TableCell>

                      <TableCell className="font-semibold">
                        {order.amount}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "Pending"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-green-200 bg-green-50 text-green-700"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
