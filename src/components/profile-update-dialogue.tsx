"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { User, Mail } from "lucide-react";

interface ProfileInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  email: string;
  image?: string | null;
}

export default function ProfileInfoDialog({
  open,
  onOpenChange,
  name,
  email,
  image,
}: ProfileInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-red-100 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Profile Information
          </DialogTitle>

          <DialogDescription>
            Your account information
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-5">
          <Avatar className="size-24 border-4 border-red-50 shadow-md">
            <AvatarImage
              src={image ?? undefined}
              alt={name}
            />

            <AvatarFallback className="bg-red-100 text-red-600 text-2xl font-bold">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {name}
          </h3>

          <p className="text-sm text-gray-500">
            Account profile
          </p>
        </div>

        <div className="space-y-3">
          {/* Name */}
          <div className="flex items-center gap-3 rounded-xl bg-red-50/50 border border-red-100 p-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white text-red-500">
              <User size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="truncate text-sm font-medium text-gray-800">
                {name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 rounded-xl bg-red-50/50 border border-red-100 p-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white text-red-500">
              <Mail size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="truncate text-sm font-medium text-gray-800">
                {email}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}