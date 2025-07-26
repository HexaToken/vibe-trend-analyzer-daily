import React, { useState, useEffect } from 'react';
import { Brain, Search, Bell, Zap, User, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { UserAuthenticationToggle } from './UserAuthenticationToggle';
import { DynamicThemeSelector } from './DynamicThemeSelector';

interface ModernHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onNavigate?: (section: string) => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  activeSection,
  setActiveSection,
  onNavigate,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { label: 'Market Mood', key: 'market-mood' },
    { label: 'News Feed', key: 'news-feed' },
    { label: 'TradeHub', key: 'tradehub' },
  ];

  const communityItems = [
    { label: 'Community Hub', key: 'community', icon: '👥' },
    { label: 'Live Chat', key: 'chat', icon: '💬' },
    { label: 'Trading Rooms', key: 'rooms', icon: '🏠' },
    { label: 'Social Feed', key: 'social', icon: '📱' },
  ];

  const financeItems = [
    { label: 'Portfolio Tracker', key: 'portfolio', icon: '📊' },
    { label: 'Watchlist', key: 'watchlist', icon: '👁️' },
    { label: 'Market Analytics', key: 'analytics', icon: '📈' },
    { label: 'Stock Screener', key: 'screener', icon: '🔍' },
    { label: 'Crypto Dashboard', key: 'crypto', icon: '₿' },
    { label: 'Earnings Calendar', key: 'earnings', icon: '📅' },
  ];

  const handleNavigation = (key: string) => {
    setActiveSection(key);
    setMobileMenuOpen(false);
    onNavigate?.(key);
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-purple-500/5" 
          : "bg-black/80 backdrop-blur-md border-b border-gray-800/30"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Branding */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200"
              aria-label="MoodMeter Home"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow duration-200">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">Mood</span>
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Meter
                </span>
              </h1>
            </button>
          </div>

          {/* Center Section - Navigation Menu (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => handleNavigation(key)}
                className={cn(
                  "text-sm md:text-base font-medium px-3 py-2 rounded-lg transition-all duration-200 relative group",
                  activeSection === key
                    ? "text-pink-400 bg-pink-500/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                )}
                aria-current={activeSection === key ? "page" : undefined}
              >
                {label}
                {activeSection === key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                )}
              </button>
            ))}

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm md:text-base font-medium px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200">
                  Community
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-56 bg-black/95 backdrop-blur-xl border-gray-700 text-white"
              >
                {communityItems.map(({ label, key, icon }) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleNavigation(key)}
                    className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
                  >
                    <span className="mr-3">{icon}</span>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Finance Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm md:text-base font-medium px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200">
                  Finance
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-56 bg-black/95 backdrop-blur-xl border-gray-700 text-white"
              >
                {financeItems.map(({ label, key, icon }) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleNavigation(key)}
                    className="hover:bg-green-500/20 focus:bg-green-500/20 cursor-pointer"
                  >
                    <span className="mr-3">{icon}</span>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Section - Search & Utility Icons */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="hidden sm:block relative">
              <div className={cn(
                "relative transition-all duration-300",
                searchFocused ? "w-80" : "w-72"
              )}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stocks, news, or sentiment…"
                  className={cn(
                    "pl-10 pr-4 py-2 bg-gray-900/50 border-gray-700 rounded-lg text-white placeholder-gray-400 transition-all duration-200",
                    "focus:bg-gray-900/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
                    searchFocused && "shadow-lg shadow-purple-500/10"
                  )}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 hover:bg-gray-800/50 rounded-lg group"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* Real-time Updates Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                realTimeEnabled 
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                  : "hover:bg-gray-800/50 text-gray-400 hover:text-gray-300"
              )}
              aria-label={`Real-time updates ${realTimeEnabled ? 'enabled' : 'disabled'}`}
            >
              <Zap className={cn("w-5 h-5", realTimeEnabled && "animate-pulse")} />
            </Button>

            {/* Theme Selector (Desktop) */}
            <div className="hidden lg:block">
              <DynamicThemeSelector />
            </div>

            {/* User Authentication */}
            <UserAuthenticationToggle onNavigate={onNavigate} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stocks, news, or sentiment…"
                  className="pl-10 pr-4 py-2 bg-gray-900/50 border-gray-700 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Mobile Navigation Items */}
            {navigationItems.map(({ label, key }) => (
              <Button
                key={key}
                variant="ghost"
                onClick={() => handleNavigation(key)}
                className={cn(
                  "w-full justify-start text-left",
                  activeSection === key
                    ? "text-pink-400 bg-pink-500/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                )}
              >
                {label}
              </Button>
            ))}

            {/* Mobile Community Section */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Community
              </div>
              {communityItems.map(({ label, key, icon }) => (
                <Button
                  key={key}
                  variant="ghost"
                  onClick={() => handleNavigation(key)}
                  className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-purple-500/20"
                >
                  <span className="mr-3">{icon}</span>
                  {label}
                </Button>
              ))}
            </div>

            {/* Mobile Finance Section */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Finance
              </div>
              {financeItems.map(({ label, key, icon }) => (
                <Button
                  key={key}
                  variant="ghost"
                  onClick={() => handleNavigation(key)}
                  className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-green-500/20"
                >
                  <span className="mr-3">{icon}</span>
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
