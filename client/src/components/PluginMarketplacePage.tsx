import { useState, useMemo } from 'react';
import { Search, Filter, Star, Download, Users, Code2, Plus, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Plugin, PluginCategory } from '@/types/plugins';
import { mockPlugins, pluginCategories, featuredPlugins, getPluginsByCategory } from '@/data/pluginMockData';
import { FeaturedPluginsCarousel } from '@/components/plugins/FeaturedPluginsCarousel';
import { PluginDetailModal } from '@/components/plugins/PluginDetailModal';
import { cn } from '@/lib/utils';

interface PluginMarketplacePageProps {
  onNavigate?: (section: string) => void;
}

export const PluginMarketplacePage = ({ onNavigate }: PluginMarketplacePageProps) => {
  const { themeMode, bodyGradient } = useMoodTheme();
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'name'>('popular');

  const filteredPlugins = useMemo(() => {
    let plugins = getPluginsByCategory(selectedCategory);
    
    // Apply search filter
    if (searchQuery) {
      plugins = plugins.filter(plugin =>
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    plugins.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'newest':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return plugins;
  }, [selectedCategory, searchQuery, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        )}
      />
    ));
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const PluginCard = ({ plugin }: { plugin: Plugin }) => (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg border",
      themeMode === 'light'
        ? "bg-white border-gray-200 hover:border-blue-300 shadow-sm"
        : "bg-black/40 border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{plugin.icon}</div>
            <div>
              <CardTitle className={cn(
                "text-lg group-hover:text-primary transition-colors",
                themeMode === 'light' ? 'text-gray-900' : 'text-white'
              )}>
                {plugin.name}
              </CardTitle>
              <div className={cn(
                "text-sm",
                themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
              )}>
                by {plugin.author}
              </div>
            </div>
          </div>
          <Badge variant={plugin.price === 0 ? "secondary" : "default"}>
            {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className={cn(
          "mb-4 line-clamp-2",
          themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
        )}>
          {plugin.shortDescription}
        </CardDescription>
        
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            {renderStars(plugin.rating)}
            <span className={themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              ({plugin.reviewCount})
            </span>
          </div>
          <div className={cn(
            "flex items-center gap-1",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
          )}>
            <Download className="w-4 h-4" />
            {formatDownloads(plugin.downloadCount)}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {plugin.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn(
                "text-xs",
                themeMode === 'light'
                  ? "border-gray-300 text-gray-600"
                  : "border-gray-600 text-gray-400"
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            {plugin.price === 0 ? 'Install' : 'Purchase'}
          </Button>
          <Button variant="outline" size="sm">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("min-h-screen", bodyGradient)}>
      {/* Hero Section */}
      <div className={cn(
        "relative px-6 py-20",
        themeMode === 'light'
          ? "bg-gradient-to-br from-blue-50 to-indigo-100"
          : "bg-gradient-to-br from-purple-900/20 to-pink-900/20"
      )}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={cn(
              "p-3 rounded-full",
              themeMode === 'light'
                ? "bg-blue-100 text-blue-600"
                : "bg-purple-500/20 text-purple-400"
            )}>
              <Zap className="w-8 h-8" />
            </div>
          </div>
          <h1 className={cn(
            "text-5xl font-bold mb-6",
            themeMode === 'light'
              ? "text-gray-900"
              : "bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
          )}>
            Unlock More Power with Plugins
          </h1>
          <p className={cn(
            "text-xl mb-8 max-w-2xl mx-auto",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-300'
          )}>
            Browse and install tools made by developers and traders like you.
            Enhance your MoodMeter experience with community-driven innovations.
          </p>
          <Button
            size="lg"
            className={cn(
              "text-lg px-8 py-3",
              themeMode === 'light'
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            )}
          >
            Browse Plugins
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Plugins Carousel */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className={cn(
              "w-6 h-6",
              themeMode === 'light' ? 'text-blue-600' : 'text-purple-400'
            )} />
            <h2 className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Featured Plugins
            </h2>
            <Badge variant="secondary" className="text-xs">
              Trending
            </Badge>
          </div>
          <FeaturedPluginsCarousel plugins={featuredPlugins} />
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter Tabs */}
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as PluginCategory)}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-6">
              {pluginCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm">
                  {category.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Plugin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPlugins.map(plugin => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>

        {/* Developer Submission CTA */}
        <Card className={cn(
          "p-8 text-center",
          themeMode === 'light'
            ? "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
            : "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20"
        )}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={cn(
              "p-3 rounded-full",
              themeMode === 'light'
                ? "bg-blue-100 text-blue-600"
                : "bg-purple-500/20 text-purple-400"
            )}>
              <Code2 className="w-8 h-8" />
            </div>
          </div>
          <h3 className={cn(
            "text-2xl font-bold mb-4",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            Build Your Own Plugin?
          </h3>
          <p className={cn(
            "text-lg mb-6 max-w-2xl mx-auto",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-300'
          )}>
            Join our developer community and integrate your tools with the MoodMeter ecosystem.
            Share your innovations with thousands of traders worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className={cn(
                themeMode === 'light'
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              )}
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Plugin
            </Button>
            <Button variant="outline" size="lg">
              Developer Docs
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
