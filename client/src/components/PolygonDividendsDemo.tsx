import { useState, useEffect } from "react";
import { DollarSign, Calendar, TrendingUp, Building } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { polygonApi, PolygonDividend } from "@/services/alphaVantageApi";

export const PolygonDividendsDemo = () => {
  const [dividends, setDividends] = useState<PolygonDividend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState("AAPL");
  const [limit, setLimit] = useState(10);

  const fetchDividends = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await polygonApi.getDividends({
        ticker: ticker.toUpperCase(),
        limit,
        sort: "pay_date",
        order: "desc"
      });
      
      setDividends(response.results || []);
    } catch (err) {
      console.error("Error fetching dividends:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dividends");
      setDividends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDividends();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return "N/A";
    return `$${amount.toFixed(4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <DollarSign className="h-8 w-8" />
          Polygon.io Dividends Demo
        </h1>
        <p className="text-muted-foreground">
          Real-time dividend data powered by Polygon.io API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Dividend Search
          </CardTitle>
          <CardDescription>
            Search for dividend information by ticker symbol
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter ticker symbol (e.g., AAPL)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Limit"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
              className="w-20"
              min="1"
              max="50"
            />
            <Button onClick={fetchDividends} disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              Error: {error}
            </div>
          )}
        </CardContent>
      </Card>

      {dividends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Dividend History for {ticker.toUpperCase()}
            </CardTitle>
            <CardDescription>
              Recent dividend payments and declarations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dividends.map((dividend, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {formatCurrency(dividend.cash_amount)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dividend.dividend_type || "Regular"}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      Frequency: {dividend.frequency || "N/A"}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Ex-Dividend Date
                      </p>
                      <p>{formatDate(dividend.ex_dividend_date)}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Pay Date
                      </p>
                      <p>{formatDate(dividend.pay_date)}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Record Date
                      </p>
                      <p>{formatDate(dividend.record_date)}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Declaration Date
                      </p>
                      <p>{formatDate(dividend.declaration_date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {dividends.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No dividend data found. Try searching for a different ticker.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};