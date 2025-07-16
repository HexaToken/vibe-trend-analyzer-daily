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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Navigation = ({
  activeSection,
  onSectionChange,
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    {
      id: "sentiment",
      label: "Sentiment Dashboard",
      icon: Brain,
      badge: "NEW",
    },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "history", label: "Historical Data", icon: Calendar },
    { id: "community", label: "Community", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => onSectionChange(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Premium Badge & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>

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
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className="justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2 mt-4"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
