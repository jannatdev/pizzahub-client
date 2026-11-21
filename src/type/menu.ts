/**
 * A menu document as stored in MongoDB and returned by the pizzahub-server
 * menu/browse APIs (createMenuItem writes `itemName`/`imageUrl`/`vendorName`,
 * the admin approve action adds `status`/`isActive`).
 */
export interface Menu {
  _id: string;
  itemName: string;
  category: string;
  description?: string;
  price: number;
  location: string;
  imageUrl: string;
  /** Optional gallery — most items only have `imageUrl`. */
  images?: string[];
  vendorId?: string;
  vendorName: string;
  vendorEmail?: string;
  /** Owning vendor's profile image, joined in by the browse API. */
  vendorImage?: string;
  status: "Pending" | "Approved" | "Rejected";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Response of GET /api/browse-menu/all. */
export interface BrowseMenusResponse {
  success: boolean;
  count: number;
  menus: Menu[];
  /** Distinct categories across ALL approved + active items. */
  categories: string[];
  /** Distinct locations across ALL approved + active items. */
  locations: string[];
}

export type MenuStatus = "Pending" | "Approved" | "Rejected";

export interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  status: MenuStatus;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMenuData {
  itemName?: string;
  category?: string;
  description?: string;
  price?: number;
  location?: string;
  imageUrl?: string;
}