"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ProfileHeader from '@/components/profile/ProfileHeader';
import TravelPreferences from '@/components/profile/TravelPreferences';
import QuickActions from '@/components/profile/QuickActions';
import RecentTrips from '@/components/profile/RecentTrips';
import SavedPlacesList from '@/components/profile/SavedPlacesList';
import AccountSettingsList from '@/components/profile/AccountSettingsList';

const Profile = () => {
  // Dynamic user data from localStorage
  const userName = localStorage.getItem('user_name') || 'Rohan Verma';
  const userEmail = localStorage.getItem('user_email') || 'rohanverma@example.com';

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto max-w-6xl space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
            <p className="text-slate-500 text-sm font-medium">Manage your account, preferences and travel information</p>
          </div>
        </div>

        {/* Main Profile Card */}
        <ProfileHeader name={userName} email={userEmail} />

        {/* Preferences and Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TravelPreferences />
          <AccountSettingsList />
        </div>

        {/* Quick Actions Section */}
        <QuickActions />

        {/* Recent Trips Section */}
        <RecentTrips />

        {/* Bottom Grid: Saved Places */}
        <div className="grid grid-cols-1 gap-8">
          <SavedPlacesList />
        </div>

        {/* Footer Copyright */}
        <div className="text-center pt-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 AI Travel Planner. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;