
import { authFetch } from "../auth-fetch";

export interface TransactionVendor {
  _id?: string;
  name?: string;
  vendorName?: string;
  email?: string;
  vendorEmail?: string;
}

export interface Transaction {
  _id: string;
  vendorId?: string | TransactionVendor;
  vendor?: TransactionVendor;
  vendorName?: string;
  vendorEmail?: string;
  plan: string;
  amount: number;
  currency?: string;
  status: string;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
}

export interface TransactionsResponse {
  success: boolean;
  total: number;
  data: Transaction[];
}
export const getAllTransactions = async (): Promise<TransactionsResponse> => {
  return await authFetch("/api/admin/transactions", {
    method: "GET",
    cache: "no-store",
  });
};
