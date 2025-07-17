import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  ExternalLink,
  Clock,
  TrendingUp,
  Globe,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import {
  useSerpTopNews,
  useSerpNewsSearch,
  useSerpBusinessNews,
  useSerpTechnologyNews,
  useSerpCryptoNews,
} from "@/hooks/useSerpApi";
import {
  useCombinedTopNews,
  useCombinedNewsSearch,
} from "@/hooks/useCombinedNews";

export function SerpApiDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // SerpAPI hooks
  const {
    articles: serpTopNews,
    loading: serpTopLoading,
    error: serpTopError,
    refetch: refetchSerpTop,
  } = useSerpTopNews();
  const {
    articles: serpSearchResults,
    loading: serpSearchLoading,
    error: serpSearchError,
  } = useSerpNewsSearch(activeSearch);
  const { articles: serpBusinessNews, loading: serpBusinessLoading } =
    useSerpBusinessNews();
  const { articles: serpTechNews, loading: serpTechLoading } =
    useSerpTechnologyNews();
  const { articles: serpCryptoNews, loading: serpCryptoLoading } =
    useSerpCryptoNews();

  // Combined news hooks
  const {
    articles: combinedTopNews,
    loading: combinedTopLoading,
    sources: combinedTopSources,
  } = useCombinedTopNews();
  const {
    articles: combinedSearchResults,
    loading: combinedSearchLoading,
    sources: combinedSearchSources,
  } = useCombinedNewsSearch(activeSearch);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 60) return "text-green-600";
    if (score <= 40) return "text-red-600";
    return "text-yellow-600";
  };

  const renderArticleCard = (article: any, source: string) => (
    <Card key={article.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight">
            {article.headline}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            {source}
          </Badge>
        </div>
        <CardDescription className="text-sm">{article.summary}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>{article.source.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(article.source.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className={getSentimentColor(article.sentimentScore)}>
              {article.sentimentScore}% sentiment
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(article.originalUrl, "_blank")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Read Full Article
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Search className="h-8 w-8" />
          SerpAPI Google News Integration
        </h1>
        <p className="text-muted-foreground">
          Enhanced news coverage with Google News via SerpAPI + existing NewsAPI
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search News</CardTitle>
          <CardDescription>
            Search across multiple news sources using both NewsAPI and SerpAPI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter search terms (e.g., 'technology stocks', 'cryptocurrency', 'AI news')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="combined" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="combined">Combined Feed</TabsTrigger>
          <TabsTrigger value="serp-top">SerpAPI Top</TabsTrigger>
          <TabsTrigger value="serp-business">SerpAPI Business</TabsTrigger>
          <TabsTrigger value="serp-tech">SerpAPI Tech</TabsTrigger>
          <TabsTrigger value="serp-crypto">SerpAPI Crypto</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
        </TabsList>

        <TabsContent value="combined">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Combined Top News (NewsAPI + SerpAPI)
              </CardTitle>
              <CardDescription>
                Unified news feed combining articles from both NewsAPI and
                SerpAPI with deduplication
              </CardDescription>
            </CardHeader>
            <CardContent>
              {combinedTopLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Loading combined news...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">NewsAPI Status</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          Articles: {combinedTopSources.newsApi.articles.length}
                        </p>
                        <p>
                          Loading:{" "}
                          {combinedTopSources.newsApi.loading ? "Yes" : "No"}
                        </p>
                        {combinedTopSources.newsApi.error && (
                          <p className="text-red-600">
                            Error: {combinedTopSources.newsApi.error}
                          </p>
                        )}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">SerpAPI Status</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          Articles: {combinedTopSources.serpApi.articles.length}
                        </p>
                        <p>
                          Loading:{" "}
                          {combinedTopSources.serpApi.loading ? "Yes" : "No"}
                        </p>
                        {combinedTopSources.serpApi.error && (
                          <p className="text-red-600">
                            Error: {combinedTopSources.serpApi.error}
                          </p>
                        )}
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    {combinedTopNews.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No articles available
                      </p>
                    ) : (
                      combinedTopNews.slice(0, 10).map((article) => {
                        const source = article.id.startsWith("serp_")
                          ? "SerpAPI"
                          : "NewsAPI";
                        return renderArticleCard(article, source);
                      })
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serp-top">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SerpAPI Top News
              </CardTitle>
              <CardDescription>
                Latest top news from Google News via SerpAPI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {serpTopNews.length} articles
                </p>
                <Button variant="outline" size="sm" onClick={refetchSerpTop}>
                  Refresh
                </Button>
              </div>

              {serpTopLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Loading SerpAPI news...
                  </p>
                </div>
              ) : serpTopError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">Error: {serpTopError}</p>
                  <Button variant="outline" onClick={refetchSerpTop}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {serpTopNews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No articles available
                    </p>
                  ) : (
                    serpTopNews
                      .slice(0, 10)
                      .map((article) => renderArticleCard(article, "SerpAPI"))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serp-business">
          <Card>
            <CardHeader>
              <CardTitle>SerpAPI Business News</CardTitle>
            </CardHeader>
            <CardContent>
              {serpBusinessLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Loading business news...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serpBusinessNews
                    .slice(0, 10)
                    .map((article) => renderArticleCard(article, "SerpAPI"))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serp-tech">
          <Card>
            <CardHeader>
              <CardTitle>SerpAPI Technology News</CardTitle>
            </CardHeader>
            <CardContent>
              {serpTechLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Loading technology news...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serpTechNews
                    .slice(0, 10)
                    .map((article) => renderArticleCard(article, "SerpAPI"))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serp-crypto">
          <Card>
            <CardHeader>
              <CardTitle>SerpAPI Cryptocurrency News</CardTitle>
            </CardHeader>
            <CardContent>
              {serpCryptoLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Loading crypto news...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serpCryptoNews
                    .slice(0, 10)
                    .map((article) => renderArticleCard(article, "SerpAPI"))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {activeSearch
                  ? `Results for: "${activeSearch}"`
                  : "Enter a search term to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!activeSearch ? (
                <p className="text-center text-muted-foreground py-8">
                  Use the search box above to find specific news articles
                </p>
              ) : combinedSearchLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Loading search results...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">
                        NewsAPI Search Results
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>
                          Articles:{" "}
                          {combinedSearchSources.newsApi.articles.length}
                        </p>
                        {combinedSearchSources.newsApi.error && (
                          <p className="text-red-600">
                            Error: {combinedSearchSources.newsApi.error}
                          </p>
                        )}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">
                        SerpAPI Search Results
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>
                          Articles:{" "}
                          {combinedSearchSources.serpApi.articles.length}
                        </p>
                        {combinedSearchSources.serpApi.error && (
                          <p className="text-red-600">
                            Error: {combinedSearchSources.serpApi.error}
                          </p>
                        )}
                      </div>
                    </Card>
                  </div>

                  {combinedSearchResults.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No results found for "{activeSearch}"
                    </p>
                  ) : (
                    combinedSearchResults.slice(0, 15).map((article) => {
                      const source = article.id.startsWith("serp_")
                        ? "SerpAPI"
                        : "NewsAPI";
                      return renderArticleCard(article, source);
                    })
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Current status of news API integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Available APIs:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>NewsAPI - Business headlines and search</li>
                <li>SerpAPI - Google News search and categories</li>
                <li>Combined feeds with deduplication</li>
                <li>Real-time updates and refresh capabilities</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Sentiment analysis scoring</li>
                <li>Source attribution and timestamps</li>
                <li>Category-specific news feeds</li>
                <li>Search across multiple providers</li>
                <li>Fallback to mock data when APIs unavailable</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">NewsAPI Integration</Badge>
            <Badge variant="outline">SerpAPI Integration</Badge>
            <Badge variant="outline">Combined News Feeds</Badge>
            <Badge variant="outline">Real-time Updates</Badge>
            <Badge variant="outline">Sentiment Analysis</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
