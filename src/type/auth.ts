export type UserRole = "customer" | "vendor" | "admin";

export interface AuthUser {
  name: string;
  email: string;
  image: string;
  role: UserRole;
  businessName?:string
}