import { useState } from "react";
import {
  Menu,
  X,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Crown,
  Brain,
  TrendingUp,
  LogIn,
  LogOut,
  UserCircle,
  Bell,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Database,
  BarChart3 as Analytics,
  Users2,
  UserPlus,
    Coins,
        Globe,
  Palette,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { ApiStatusBadge } from "@/components/ApiStatusIndicator";

import { MoodThemeToggle } from "@/components/ui/mood-theme-toggle";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Navigation = ({
  activeSection,
  onSectionChange,
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, isAuthenticated, logout } = useAuth();

  const navigationGroups = {
    data: [
      // Removed Crypto Dashboard view - retained crypto components for Finance section reuse
      {
        id: "finnhub",
        label: "Finnhub Stock Data",
        icon: TrendingUp,
        badge: "NEW",
      },
      // Removed Stock Sentiment Scoring view - retained sentiment analysis utilities
      {
        id: "ai-analysis",
        label: "AI Sentiment Analysis",
        icon: Brain,
        badge: "NEW",
      },
      {
        id: "spacy-nlp",
        label: "spaCy NLP Analysis",
        icon: Brain,
        badge: "NEW",
      },
      {
        id: "yfinance",
        label: "YFinance Integration",
        icon: Globe,
        badge: "NEW",
      },
      // Removed Historical Data view - retained data hooks for potential reuse
      { id: "database", label: "Database Demo", icon: Database, badge: "DEMO" },
    ],
    social: [
      {
        id: "social",
        label: "FinTwits Social",
        icon: MessageSquare,
        badge: "HOT",
      },
      { id: "community", label: "Community", icon: Users },
    ],
    tools: [
      { id: "analytics", label: "Analytics", icon: TrendingUp },

      {
        id: "nlp",
        label: "NLP Sentiment Analysis",
        icon: Brain,
        badge: "AI",
      },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  };

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

    const handleLogout = () => {
    logout();
    // Redirect to home if currently on protected pages
    if (activeSection === "profile") {
      onSectionChange("home");
    }
  };

  const handleProfileClick = () => {
    onSectionChange("profile");
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
                        {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                MoodMeter
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                v2.0
              </Badge>
              <div className="hidden sm:inline-flex">
                <ApiStatusBadge />
              </div>

            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
                                                        

                            {/* Futuristic Homepage */}
              <Button
                variant={activeSection === "futuristic-home" ? "default" : "ghost"}
                onClick={() => onSectionChange("futuristic-home")}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Futuristic Home
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border-cyan-400/30">
                  FUTURE
                </Badge>
              </Button>

              

              {/* Data Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    Data
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                                    {navigationGroups.data.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                                    {/* Removed Mood Theme Demo view - retained MoodThemeProvider for global theming */}
                  {/* Removed Builder.io Finance Components view - retained builder components for reuse */}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Social Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    Social
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {navigationGroups.social.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

                            
            </div>

                        {/* User Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <MoodThemeToggle />

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
                    >
                      3
                    </Badge>
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.username} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {(
                              user?.firstName?.[0] || user?.username?.[0] || '?'
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.firstName && user?.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user?.username}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {user?.isPremium && (
                              <Badge variant="secondary" className="text-xs">
                                Premium
                              </Badge>
                            )}
                            {user?.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onSectionChange("settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Guest User Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAuthModal("login")}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <UserCircle className="h-4 w-4" />
                    Sign In / Sign Up
                  </Button>
                </>
              )}

              {/* Premium Badge for guests */}
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-500 hover:from-yellow-600 hover:to-yellow-700"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                

                {/* Data Section */}
                <div className="text-sm font-medium text-muted-foreground px-3 py-1">
                  Data
                </div>
                {navigationGroups.data.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      onClick={() => {
                        onSectionChange(item.id);
                        setIsMenuOpen(false);
                      }}
                      className="justify-start gap-2 ml-4"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}

                {/* Social Section */}
                <div className="text-sm font-medium text-muted-foreground px-3 py-1">
                  Social
                </div>
                {navigationGroups.social.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      onClick={() => {
                        onSectionChange(item.id);
                        setIsMenuOpen(false);
                      }}
                      className="justify-start gap-2 ml-4"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}

                                

                {/* Mobile Auth Section */}
                <div className="pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 w-full"
                        onClick={handleProfileClick}
                      >
                        <UserCircle className="h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 w-full"
                        onClick={() => {
                          openAuthModal("login");
                          setIsMenuOpen(false);
                        }}
                      >
                        <UserCircle className="h-4 w-4" />
                        Sign In / Sign Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2 w-full mt-4"
                      >
                        <Crown className="h-4 w-4" />
                        Upgrade to Pro
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};
