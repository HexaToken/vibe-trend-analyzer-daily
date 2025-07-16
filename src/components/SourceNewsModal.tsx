import { useState } from "react";
import { X, ExternalLink, Share, Clock, TrendingUp, TrendingDown, Newspaper } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NewsArticle, newsArticlesBySource } from "@/data/mockData";
import { NewsDetailModal } from "./NewsDetailModal";

interface SourceNewsModalProps {
  sourceName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceNewsModal = ({ sourceName, isOpen, onClose }: SourceNewsModalProps) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (!sourceName) return null;

  const articles = newsArticlesBySource[sourceName as keyof typeof newsArticlesBySource] || [];

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDetailModalOpen(true);
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
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "News": return "📰";
      case "Social Media": return "📱";
      case "Forums": return "💬";
      case "Stock Market": return "📈";
      default: return "📄";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <span className="text-2xl">{getSourceIcon(sourceName)}</span>
              {sourceName} Sentiment Analysis
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Recent articles and content driving sentiment scores for {sourceName.toLowerCase()}
            </div>

            <Separator />

            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => handleArticleClick(article)}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
                          {article.headline}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`text-sm whitespace-nowrap ${getSentimentColor(article.sentimentScore)}`}
                        >
                          <div className="flex items-center gap-1">
                            {article.sentimentScore >= 50 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {getSentimentLabel(article.sentimentScore)} {article.sentimentScore}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-foreground">
                            {article.source.name}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(article.source.publishedAt)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {article.keyPhrases.slice(0, 3).map((phrase, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {phrase}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-muted/20 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Why it matters:</span> {article.whyItMatters}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Recent Articles</h3>
                <p className="text-muted-foreground">
                  No recent articles found for {sourceName.toLowerCase()} sentiment analysis.
                </p>
              </div>
            )}

            <Separator />

            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {articles.length} articles analyzed for {sourceName.toLowerCase()} sentiment
                </span>
                <Badge variant="secondary">
                  Real-time analysis
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <NewsDetailModal
        article={selectedArticle}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
};