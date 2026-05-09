"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Bookmark, 
  MessageSquare, 
  Bell, 
  User, 
  Settings,
  Plane,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Bookmark, label: 'My Trips', path: '/trips' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/assistant' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
  ];

  const handleNavigation = (path: string, label: string) => {
    if (path === '/settings') {
      showSuccess("Settings feature coming soon!");
      return;
    }
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="rounded-xl overflow-hidden">
            <img 
              src="./logo.png" alt="AI Travel Logo" className="w-20 h-20 object-contain"/>
          </div>
          <span className="font-bold text-3xl tracking-tight text-slate-900">
            AI <span className="text-primary">Travel</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={idx}
                onClick={() => handleNavigation(item.path, item.label)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm",
                  isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
            className="rounded-full text-slate-500"
          >
            <User className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={idx}
                onClick={() => handleNavigation(item.path, item.label)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold",
                  isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;