"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <DialogContent className="max-w-sm rounded-2xl border border-red-100 bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            My Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <Avatar className="h-24 w-24 border-4 border-red-50">
            <AvatarImage src={image || undefined} />
            <AvatarFallback className="bg-red-100 text-2xl text-red-600">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {name}
          </h3>

          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-red-50/50 p-4">
            <User className="text-red-500" size={20} />

            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-sm font-medium text-gray-800">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-red-50/50 p-4">
            <Mail className="text-red-500" size={20} />

            <div className="min-w-0">
              <p className="text-xs text-gray-400">Email Address</p>
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