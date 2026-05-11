"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Edit3, CheckCircle2, Camera, Save, X, LogOut } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  name: string;
  email: string;
}

const ProfileHeader = ({ name: initialName, email: initialEmail }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [avatarUrl, setAvatarUrl] = React.useState(
    localStorage.getItem('user_avatar_data') || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('user_avatar_seed') || initialName}`
  );
  
  const [formData, setFormData] = React.useState({
    name: localStorage.getItem('user_name') || initialName,
    email: localStorage.getItem('user_email') || initialEmail,
    phone: localStorage.getItem('user_phone') || '+91 98765 43210',
    location: localStorage.getItem('user_location') || 'Mumbai, Maharashtra, India'
  });

  const handleSave = () => {
    localStorage.setItem('user_name', formData.name);
    localStorage.setItem('user_email', formData.email);
    localStorage.setItem('user_phone', formData.phone);
    localStorage.setItem('user_location', formData.location);
    
    setIsEditing(false);
    showSuccess("Profile updated successfully!");
    window.dispatchEvent(new Event('storage'));
  };

  const handleCancel = () => {
    setFormData({
      name: localStorage.getItem('user_name') || initialName,
      email: localStorage.getItem('user_email') || initialEmail,
      phone: localStorage.getItem('user_phone') || '+91 98765 43210',
      location: localStorage.getItem('user_location') || 'Mumbai, Maharashtra, India'
    });
    setIsEditing(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    showSuccess("Signed out successfully");
    navigate('/login');
    window.dispatchEvent(new Event('storage'));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showError("File is too large. Please select an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('user_avatar_data', base64String);
        showSuccess("Profile picture updated!");
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-8 bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={triggerFileInput}
            className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary transition-colors"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          {isEditing ? (
            <div className="space-y-3 max-w-md">
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Full Name"
                className="h-10 rounded-xl"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                  className="h-10 rounded-xl"
                />
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Phone"
                  className="h-10 rounded-xl"
                />
              </div>
              <Input 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Location"
                className="h-10 rounded-xl"
              />
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} className="rounded-xl h-10 px-6 gap-2">
                  <Save size={16} /> Save Changes
                </Button>
                <Button variant="ghost" onClick={handleCancel} className="rounded-xl h-10 px-6 gap-2">
                  <X size={16} /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-3xl font-black text-slate-900">{formData.name}</h2>
                  <CheckCircle2 className="text-primary w-6 h-6 fill-primary/10" />
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> {formData.email}</span>
                  <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {formData.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {formData.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl border-slate-200 font-bold gap-2 h-10 px-6"
                >
                  <Edit3 size={16} /> Edit Profile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 font-bold gap-2 h-10 px-6"
                >
                  <LogOut size={16} /> Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 lg:gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 w-full md:w-auto justify-center">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
              <div className="w-6 h-6 bg-blue-500 rounded-lg" />
            </div>
            <p className="text-xl font-black text-slate-900">12</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trips Planned</p>
          </div>
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
              <div className="w-6 h-6 bg-emerald-500 rounded-lg" />
            </div>
            <p className="text-xl font-black text-slate-900">8</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trips Completed</p>
          </div>
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto">
              <div className="w-6 h-6 bg-amber-500 rounded-lg" />
            </div>
            <p className="text-xl font-black text-slate-900">4.7</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Rating</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;