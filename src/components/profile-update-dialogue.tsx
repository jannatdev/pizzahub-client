"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail } from "lucide-react";

interface ProfileInfoDialogProps {
  name: string;
  email: string;
  image?: string | null;
}

export default function ProfileInfoDialog({
  name,
  email,
  image,
}: ProfileInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger >
        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 transition">
          <User size={17} />
          Profile Settings
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border border-red-100 bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            My Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          {/* Profile Image */}
          <Avatar className="h-24 w-24 border-4 border-red-50 shadow-sm">
            <AvatarImage src={image || undefined} alt={name} />
            <AvatarFallback className="bg-red-100 text-xl font-semibold text-red-600">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {name}
          </h3>

          {/* Email */}
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="rounded-lg bg-red-100 p-2 text-red-600">
              <User size={18} />
            </div>

            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-sm font-medium text-gray-800">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="rounded-lg bg-red-100 p-2 text-red-600">
              <Mail size={18} />
            </div>

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