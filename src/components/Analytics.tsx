import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, TrendingUp, Users, Clock, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from "recharts";

export const Analytics = () => {
  const performanceData = [
    { source: "News", accuracy: 94, coverage: 87, speed: 92 },
    { source: "Social", accuracy: 89, coverage: 95, speed: 98 },
    { source: "Forums", accuracy: 91, coverage: 78, speed: 85 },
    { source: "Stocks", accuracy: 96, coverage: 82, speed: 94 }
  ];

  const sentimentDistribution = [
    { name: "Positive", value: 45, color: "hsl(var(--positive))" },
    { name: "Neutral", value: 32, color: "hsl(var(--neutral))" },
    { name: "Negative", value: 23, color: "hsl(var(--negative))" }
  ];

  const topKeywords = [
    { keyword: "innovation", mentions: 15420, sentiment: 8.2 },
    { keyword: "growth", mentions: 12350, sentiment: 7.8 },
    { keyword: "uncertainty", mentions: 9870, sentiment: -4.5 },
    { keyword: "opportunity", mentions: 8760, sentiment: 6.9 },
    { keyword: "challenge", mentions: 7650, sentiment: -2.1 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Advanced Analytics</h1>
        <p className="text-xl text-muted-foreground">
          Deep insights into sentiment patterns and AI performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-positive">92.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Active monitoring points</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground">Avg analysis time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81.7K</div>
            <p className="text-xs text-muted-foreground">Processed today</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Source Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px" 
                    }} 
                  />
                  <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Accuracy %" />
                  <Bar dataKey="coverage" fill="hsl(var(--positive))" name="Coverage %" />
                  <Bar dataKey="speed" fill="hsl(var(--neutral))" name="Speed %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Sentiment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={sentimentDistribution} cx="50%" cy="50%" outerRadius={80}>
                    {sentimentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {sentimentDistribution.map((item, index) => (
                <div key={index}>
                  <div className="w-4 h-4 rounded mx-auto mb-2" style={{ backgroundColor: item.color }} />
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Keywords & Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topKeywords.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">#{keyword.keyword}</div>
                    <div className="text-sm text-muted-foreground">
                      {keyword.mentions.toLocaleString()} mentions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={keyword.sentiment > 0 ? "default" : "destructive"}>
                    {keyword.sentiment > 0 ? '+' : ''}{keyword.sentiment.toFixed(1)} impact
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Primary Models</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>BERT-Sentiment-Large</span>
                  <Badge variant="outline">94% accuracy</Badge>
                </li>
                <li className="flex justify-between">
                  <span>FinBERT-Financial</span>
                  <Badge variant="outline">96% accuracy</Badge>
                </li>
                <li className="flex justify-between">
                  <span>RoBERTa-Social</span>
                  <Badge variant="outline">89% accuracy</Badge>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Processing Pipeline</h3>
              <ul className="space-y-2 text-sm">
                <li>• Data ingestion & preprocessing</li>
                <li>• Multi-model ensemble analysis</li>
                <li>• Confidence scoring & validation</li>
                <li>• Real-time aggregation & display</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};