"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Lock, Bell, Shield, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '@/utils/toast';

const AccountSettingsList = () => {
  const settings = [
    { id: 'personal', icon: User, label: 'Personal Information', color: 'text-slate-400' },
    { id: 'password', icon: Lock, label: 'Change Password', color: 'text-slate-400' },
    { id: 'notifications', icon: Bell, label: 'Notification Settings', color: 'text-slate-400' },
    { id: 'privacy', icon: Shield, label: 'Privacy & Security', color: 'text-slate-400' },
    { id: 'delete', icon: Trash2, label: 'Delete Account', color: 'text-red-500', isDanger: true },
  ];

  const handleSettingClick = (id: string, label: string) => {
    switch (id) {
      case 'personal':
        showSuccess("Opening personal information editor...");
        break;
      case 'password':
        showSuccess("A password reset link has been sent to your email.");
        break;
      case 'notifications':
        showSuccess("Notification preferences updated to 'Smart Alerts'.");
        break;
      case 'privacy':
        showSuccess("Privacy scan complete. Your account is secure.");
        break;
      case 'delete':
        showError("Critical: Please contact support to initiate account deletion.");
        break;
      default:
        showSuccess(`Opening ${label}...`);
    }
  };

  return (
    <Card className="p-6 bg-white border-slate-100 rounded-[2rem] shadow-sm h-full">
      <h3 className="text-lg font-black text-slate-900 mb-6">Account Settings</h3>
      <div className="space-y-1">
        {settings.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSettingClick(item.id, item.label)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-slate-50 group",
              item.isDanger && "hover:bg-red-50"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-4 h-4", item.color)} />
              <span className={cn("text-sm font-bold", item.isDanger ? "text-red-500" : "text-slate-600")}>
                {item.label}
              </span>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
          </button>
        ))}
      </div>
    </Card>
  );
};

export default AccountSettingsList;