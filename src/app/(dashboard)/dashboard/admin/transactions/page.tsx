"use client";

import { Receipt } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";
 

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ReceiptText,
  Eye,
} from "lucide-react";


import { toast } from "sonner";

import {
  getAllTransactions,
  type Transaction,
} from "@/lib/api/admin/transaction";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatusFilter = "all" | "successful" | "pending" | "failed";

const getVendorName = (transaction: Transaction) => {
  return (
    transaction.vendorName ||
    transaction.vendor?.name ||
    transaction.vendor?.vendorName ||
    "Unknown vendor"
  );
};

const getVendorEmail = (transaction: Transaction) => {
  return (
    transaction.vendorEmail ||
    transaction.vendor?.email ||
    transaction.vendor?.vendorEmail ||
    ""
  );
};

const getVendorId = (transaction: Transaction) => {
  if (typeof transaction.vendorId === "string") {
    return transaction.vendorId;
  }

  return transaction.vendorId?._id || "";
};

const getStatusCategory = (status: string) => {
  const normalized = status.toLowerCase();

  if (
    ["success", "successful", "succeeded", "paid", "completed"].includes(
      normalized
    )
  ) {
    return "successful";
  }

  if (["pending", "processing", "incomplete"].includes(normalized)) {
    return "pending";
  }

  if (
    ["failed", "failure", "cancelled", "canceled", "refunded"].includes(
      normalized
    )
  ) {
    return "failed";
  }

  return "other";
};

const getStatusStyle = (status: string) => {
  const category = getStatusCategory(status);

  if (category === "successful") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (category === "pending") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (category === "failed") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-gray-200 bg-gray-50 text-gray-600";
};

const getStatusIcon = (status: string) => {
  const category = getStatusCategory(status);

  if (category === "successful") {
    return <CheckCircle2 size={14} />;
  }

  if (category === "pending") {
    return <Clock size={14} />;
  }

  if (category === "failed") {
    return <XCircle size={14} />;
  }

  return <ReceiptText size={14} />;
};

const formatAmount = (amount: number, currency = "BDT") => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency.toUpperCase()} ${numericAmount.toLocaleString()}`;
  }
};

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

// Handle common API response structures.
const extractTransactions = (response: unknown): Transaction[] => {
  if (Array.isArray(response)) {
    return response as Transaction[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const data = response as Record<string, unknown>;

  if (Array.isArray(data.transactions)) {
    return data.transactions as Transaction[];
  }

  if (Array.isArray(data.data)) {
    return data.data as Transaction[];
  }

  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;

    if (Array.isArray(nested.transactions)) {
      return nested.transactions as Transaction[];
    }
  }

  return [];
};


export default function TransactionsPage() {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await getAllTransactions();

      console.log("Admin transactions API response:", response);

      setTransactions(extractTransactions(response));
    } catch (error) {
      console.error("Failed to fetch transactions:", error);

      setTransactions([]);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  // Refresh
  const handleRefresh = async () => {
    setLoading(true);
    await fetchTransactions();
  };

  // Search and status filtering
  const filteredTransactions = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const vendorName = getVendorName(transaction);
      const vendorEmail = getVendorEmail(transaction);
      const vendorId = getVendorId(transaction);

      const matchesSearch = [
        vendorName,
        vendorEmail,
        vendorId,
        transaction.plan,
        transaction.status,
        transaction.stripeSessionId,
        transaction.stripeSubscriptionId,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(searchText)
      );

      const category = getStatusCategory(transaction.status);

      const matchesStatus =
        statusFilter === "all" ||
        category === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  // Statistics
  const totalTransactions = transactions.length;

  const successfulTransactions = transactions.filter(
    (transaction) =>
      getStatusCategory(transaction.status) === "successful"
  ).length;

  const pendingTransactions = transactions.filter(
    (transaction) =>
      getStatusCategory(transaction.status) === "pending"
  ).length;

  const failedTransactions = transactions.filter(
    (transaction) =>
      getStatusCategory(transaction.status) === "failed"
  ).length;

  const stats = [
    {
      title: "Total Transactions",
      value: totalTransactions,
      icon: CreditCard,
      iconStyle: "bg-red-50 text-red-600",
    },
    {
      title: "Successful",
      value: successfulTransactions,
      icon: CheckCircle2,
      iconStyle: "bg-green-50 text-green-600",
    },
    {
      title: "Pending",
      value: pendingTransactions,
      icon: Clock,
      iconStyle: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Failed",
      value: failedTransactions,
      icon: XCircle,
      iconStyle: "bg-orange-50 text-orange-600",
    },
  ];

  return (

    <div className="bg-red-50/25">

       <PagePlaceholder
      icon={Receipt}
      title="Transactions"
      description="View-only history of Premium subscription payments."
    />
      <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ReceiptText size={21} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Transactions
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Monitor vendor subscriptions and payment records.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="border-gray-200 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon size={23} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden border-gray-200 shadow-sm">
        <CardHeader className="space-y-4 border-b border-gray-100">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Payment History
              </CardTitle>

              <p className="mt-1 text-sm text-gray-500">
                View vendor subscription payment records.
              </p>
            </div>

            <Badge
              variant="outline"
              className="w-fit border-red-200 bg-red-50 text-red-600"
            >
              {filteredTransactions.length} Records
            </Badge>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vendor, email, plan, transaction..."
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as StatusFilter)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="min-w-[220px]">
                    Vendor
                  </TableHead>

                  <TableHead className="min-w-[130px]">
                    Subscription
                  </TableHead>

                  <TableHead className="min-w-[130px]">
                    Amount
                  </TableHead>

                  <TableHead className="min-w-[130px]">
                    Payment Status
                  </TableHead>

                  <TableHead className="min-w-[180px]">
                    Transaction Date
                  </TableHead>

                  <TableHead className="min-w-[120px] text-right">
                    Record
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-40 text-center text-gray-500"
                    >
                      <RefreshCw
                        size={20}
                        className="mx-auto mb-2 animate-spin text-red-500"
                      />
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-48 text-center"
                    >
                      <ReceiptText
                        size={35}
                        className="mx-auto mb-3 text-gray-300"
                      />

                      <p className="font-semibold text-gray-800">
                        No transactions found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {transactions.length === 0
                          ? "No payment records are available yet."
                          : "Try changing your search or status filter."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const vendorName = getVendorName(transaction);
                    const vendorEmail = getVendorEmail(transaction);

                    return (
                      <TableRow
                        key={transaction._id}
                        className="transition-colors hover:bg-red-50/30"
                      >
                        {/* Vendor */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 font-bold text-red-600">
                              {vendorName.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900">
                                {vendorName}
                              </p>

                              <p className="max-w-[190px] truncate text-xs text-gray-500">
                                {vendorEmail || getVendorId(transaction) || "Vendor information unavailable"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Subscription */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-orange-200 bg-orange-50 font-medium text-orange-700"
                          >
                            {transaction.plan || "Unknown plan"}
                          </Badge>
                        </TableCell>

                        {/* Amount */}
                        <TableCell>
                          <p className="font-bold text-gray-900">
                            {formatAmount(
                              transaction.amount,
                              transaction.currency
                            )}
                          </p>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex w-fit items-center gap-1.5 capitalize ${getStatusStyle(
                              transaction.status
                            )}`}
                          >
                            {getStatusIcon(transaction.status)}
                            {transaction.status || "Unknown"}
                          </Badge>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </TableCell>

                        {/* Read-only record indicator */}
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <Eye size={15} />
                            View only
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          {!loading && transactions.length > 0 && (
            <div className="flex flex-col justify-between gap-2 border-t bg-gray-50/70 px-5 py-3 text-xs text-gray-500 sm:flex-row sm:items-center">
              <p>
                Showing {filteredTransactions.length} of{" "}
                {transactions.length} transactions
              </p>

              <p className="flex items-center gap-1.5">
                <Eye size={14} />
                Payment records are read-only
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
   
  );
}
