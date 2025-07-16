import { useState } from "react";
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsDetailModal } from "./NewsDetailModal";
import { useBusinessNews } from "@/hooks/useNewsApi";

export const TopNews = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-positive";
    if (score >= 40) return "text-neutral";
    return "text-negative";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Positive";
    if (score >= 40) return "Neutral";
    return "Negative";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Top News Impacting Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {newsArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => handleArticleClick(article)}
              className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight mb-2 hover:text-primary transition-colors">
                    {article.headline}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getSentimentColor(article.sentimentScore)}`}
                      >
                        <div className="flex items-center gap-1">
                          {article.sentimentScore >= 50 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {getSentimentLabel(article.sentimentScore)}{" "}
                          {article.sentimentScore}
                        </div>
                      </Badge>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.source.publishedAt)}
                      </div>
                    </div>

                    <span className="text-xs font-medium text-muted-foreground">
                      {article.source.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              Click any article to see detailed sentiment analysis and insights
            </p>
          </div>
        </CardContent>
      </Card>

      <NewsDetailModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
