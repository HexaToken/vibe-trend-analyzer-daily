import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MoodScoreProps {
  score: number;
  previousScore?: number;
}

export const MoodScore = ({ score, previousScore = 68 }: MoodScoreProps) => {
  const change = score - previousScore;
  const isPositive = change >= 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-positive";
    if (score >= 50) return "text-neutral";
    return "text-negative";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Extremely Positive";
    if (score >= 70) return "Positive";
    if (score >= 60) return "Moderately Positive";
    if (score >= 50) return "Neutral";
    if (score >= 40) return "Moderately Negative";
    if (score >= 30) return "Negative";
    return "Extremely Negative";
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold text-center">
          Daily Mood Score
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="text-center">
          <div className={`text-8xl font-bold ${getScoreColor(score)} mb-2`}>
            {score}
          </div>
          <div className="text-xl text-muted-foreground font-medium">
            {getScoreDescription(score)}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-positive" />
          ) : (
            <TrendingDown className="h-5 w-5 text-negative" />
          )}
          <span className={`font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)} from yesterday
          </span>
        </div>

        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              score >= 70 ? 'bg-gradient-to-r from-positive to-positive-light' :
              score >= 50 ? 'bg-gradient-to-r from-neutral to-neutral-light' :
              'bg-gradient-to-r from-negative to-negative-light'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Updated 5 minutes ago • Based on 81,750 data points
        </div>
      </CardContent>
    </Card>
  );
};