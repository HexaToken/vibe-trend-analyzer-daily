import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useYCNBCData } from "@/hooks/useYCNBC";
import { 
  Globe, 
  TrendingUp, 
  Activity, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Clock
} from "lucide-react";

export const YCNBCDemo = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { latestNews, trendingNews, sentiment, isLoading, isError } = useYCNBCData(300000); // 5 minutes
  
  // Check if any of the individual queries have errors
  const hasActualError = (latestNews.error || trendingNews.error || sentiment.error) && 
                        !(latestNews.data || trendingNews.data || sentiment.data);

  const formatSentimentScore = (score: number): { label: string; color: string } => {
    if (score >= 75) return { label: "Very Positive", color: "text-green-600" };
    if (score >= 60) return { label: "Positive", color: "text-green-500" };
    if (score >= 40) return { label: "Neutral", color: "text-yellow-500" };
    if (score >= 25) return { label: "Negative", color: "text-red-500" };
    return { label: "Very Negative", color: "text-red-600" };
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "Recently";
    if (timeStr.includes("Hour")) return timeStr;
    if (timeStr.includes("Minutes")) return timeStr;
    return timeStr;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Globe className="h-8 w-8 text-blue-600" />
          YCNBC Integration Demo
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Enhanced CNBC data integration using the ycnbc Python package for real-time news sentiment analysis and market insights.
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">YCNBC Service</CardTitle>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
              ) : hasActualError ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={hasActualError ? "destructive" : isLoading ? "secondary" : "default"}>
              {hasActualError ? "Error" : isLoading ? "Loading" : "Active"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">News Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(latestNews.data?.total || 0) + (trendingNews.data?.total || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Latest + Trending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sentiment Score</CardTitle>
          </CardHeader>
          <CardContent>
            {sentiment.data?.sentiment_score !== undefined ? (
              <div>
                <div className="text-2xl font-bold">{sentiment.data.sentiment_score}</div>
                <p className={`text-xs ${formatSentimentScore(sentiment.data.sentiment_score).color}`}>
                  {formatSentimentScore(sentiment.data.sentiment_score).label}
                </p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {hasActualError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to YCNBC service. This may be due to network issues or service configuration.
            {latestNews.error && <div className="mt-1">Latest News: {latestNews.error.message}</div>}
            {trendingNews.error && <div className="mt-1">Trending News: {trendingNews.error.message}</div>}
            {sentiment.error && <div className="mt-1">Sentiment: {sentiment.error.message}</div>}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="latest">Latest News</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest News Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Latest CNBC News
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestNews.data?.articles?.slice(0, 3).map((article, index) => (
                  <div key={article.id} className="border-b pb-3 mb-3 last:border-b-0 last:mb-0">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{article.headline}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTime(article.time)}</span>
                      <Badge variant="outline" className="text-xs">
                        Sentiment: {article.sentiment_score.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-sm text-muted-foreground">Loading news...</div>}
              </CardContent>
            </Card>

            {/* Trending News Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trendingNews.data?.articles?.slice(0, 3).map((article, index) => (
                  <div key={article.id} className="border-b pb-3 mb-3 last:border-b-0 last:mb-0">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{article.headline}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTime(article.time)}</span>
                      <Badge variant="outline" className="text-xs">
                        Sentiment: {article.sentiment_score.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-sm text-muted-foreground">Loading trending...</div>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="latest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest CNBC News Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestNews.data?.articles?.map((article) => (
                  <div key={article.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-lg mb-2 flex-1">{article.headline}</h3>
                      <ExternalLink 
                        className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer ml-2 flex-shrink-0"
                        onClick={() => window.open(article.url, '_blank')}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(article.time)}
                        </span>
                        <Badge variant="outline">{article.source}</Badge>
                      </div>
                      <Badge 
                        variant={article.sentiment_score > 0 ? "default" : article.sentiment_score < 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        Sentiment: {article.sentiment_score.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-center text-muted-foreground">Loading latest news...</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending CNBC Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingNews.data?.articles?.map((article) => (
                  <div key={article.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-lg mb-2 flex-1">{article.headline}</h3>
                      <ExternalLink 
                        className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer ml-2 flex-shrink-0"
                        onClick={() => window.open(article.url, '_blank')}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(article.time)}
                        </span>
                        <Badge variant="outline">{article.source}</Badge>
                      </div>
                      <Badge 
                        variant={article.sentiment_score > 0 ? "default" : article.sentiment_score < 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        Sentiment: {article.sentiment_score.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-center text-muted-foreground">Loading trending stories...</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Enhanced Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sentiment.data ? (
                <div className="space-y-6">
                  {/* Sentiment Score Display */}
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">{sentiment.data.sentiment_score}</div>
                    <div className={`text-xl font-medium ${formatSentimentScore(sentiment.data.sentiment_score).color}`}>
                      {formatSentimentScore(sentiment.data.sentiment_score).label}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Based on {sentiment.data.article_count} articles
                    </div>
                  </div>

                  {/* Sentiment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Raw Sentiment Score</h4>
                      <div className="text-2xl font-bold">{sentiment.data.raw_sentiment}</div>
                      <div className="text-sm text-muted-foreground">(-1.0 to +1.0 scale)</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Articles Analyzed</h4>
                      <div className="text-2xl font-bold">{sentiment.data.article_count}</div>
                      <div className="text-sm text-muted-foreground">CNBC articles</div>
                    </div>
                  </div>

                  {/* Sample Articles */}
                  <div>
                    <h4 className="font-semibold mb-3">Sample Articles Used</h4>
                    <div className="space-y-2">
                      {sentiment.data.latest_articles?.slice(0, 3).map((article) => (
                        <div key={article.id} className="text-sm p-3 border rounded-lg">
                          <div className="font-medium mb-1">{article.headline}</div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Sentiment: {article.sentiment_score.toFixed(2)}</span>
                            <span>{article.source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">Loading sentiment analysis...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">Data Source</h4>
              <p className="text-sm text-muted-foreground">CNBC via ycnbc package</p>
            </div>
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold">Update Frequency</h4>
              <p className="text-sm text-muted-foreground">Every 5 minutes</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold">Sentiment Analysis</h4>
              <p className="text-sm text-muted-foreground">NLP-based scoring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};