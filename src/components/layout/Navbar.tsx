"use client";

import React from 'react';
import { 
  Compass, 
  Bookmark, 
  MessageSquare, 
  Bell, 
  Plane,
  Menu,
  X,
  Navigation,
  Home,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userName, setUserName] = React.useState(localStorage.getItem('user_name') || 'Traveler');
  
  const [avatarUrl, setAvatarUrl] = React.useState(
    localStorage.getItem('user_avatar_data') || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('user_avatar_seed') || userName}`
  );

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      const name = localStorage.getItem('user_name') || 'Traveler';
      setUserName(name);
      
      const customAvatar = localStorage.getItem('user_avatar_data');
      if (customAvatar) {
        setAvatarUrl(customAvatar);
      } else {
        setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('user_avatar_seed') || name}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage-local', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage-local', handleStorageChange);
    };
  }, [userName]);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Navigation, label: 'Navigate', path: '/navigate' },
    { icon: Bookmark, label: 'My Trips', path: '/trips' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/assistant' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
  ];

  const handleNavigation = (path: string) => {
    if (path !== '/' && !isLoggedIn) {
      navigate('/login');
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="rounded-xl overflow-hidden">
        <img src="./logo.png" alt="AI Travel Logo" className="w-20 h-20 object-contain"/>
      </div>

  <span className="font-black text-2xl tracking-tighter text-slate-900">
    AI <span className="text-primary">Travel</span>
  </span>
</div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={idx}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-sm",
                  isActive ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="font-bold text-slate-600 hover:text-primary rounded-xl px-6"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                className="font-black bg-primary hover:bg-primary/90 text-white rounded-xl px-6 shadow-lg shadow-primary/20"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 font-bold text-slate-600 hover:text-primary rounded-xl px-4"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">{userName}</span>
            </Button>
          )}
          
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
        <div className="lg:hidden bg-white border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-2">
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold",
                    isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
          {!isLoggedIn && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => handleNavigation('/login')} className="rounded-xl font-bold h-12">Login</Button>
              <Button onClick={() => handleNavigation('/login')} className="rounded-xl font-black h-12">Sign Up</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;