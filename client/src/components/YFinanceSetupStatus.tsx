import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";

interface YFinanceStatusResponse {
  status: "available" | "not_available" | "timeout" | "error";
  code?: number;
  output?: string[];
  error?: string | null;
  setup_instructions?: string[];
}

export const YFinanceSetupStatus: React.FC = () => {
  const [status, setStatus] = useState<YFinanceStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [hasCriticalError, setHasCriticalError] = useState(false);

  const checkStatus = async () => {
    if (hasCriticalError) return;

    setLoading(true);
    try {
      // Use manual AbortController for better compatibility
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch("/api/proxy/yfinance/status", {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
        cache: "no-cache",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStatus(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error("Failed to check YFinance status:", error);
      setRetryAttempts((prev) => prev + 1);

      // Provide different error messages based on error type
      let errorMessage = "Failed to connect to YFinance service";
      if (error.name === "AbortError") {
        errorMessage = "Request timeout - service may be slow";
      } else if (error.message.includes("fetch")) {
        errorMessage = "Network connectivity issue";
      }

      // If this is the first failure, assume YFinance is not available rather than erroring
      if (retryAttempts === 0) {
        setStatus({
          status: "not_available",
          error: null,
          output: ["YFinance package not detected"],
          setup_instructions: [
            "Install YFinance and pandas:",
            "pip install yfinance pandas",
            "Or using uv:",
            "uv add yfinance pandas",
          ],
        });
      } else {
        setStatus({
          status: "error",
          error: errorMessage,
          setup_instructions: [
            "Install YFinance and pandas:",
            "pip install yfinance pandas",
            "Or using uv:",
            "uv add yfinance pandas",
          ],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use a timeout to avoid blocking the component render
    const timeoutId = setTimeout(() => {
      checkStatus().catch(console.error);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

    switch (status?.status) {
      case "available":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "not_available":
      case "timeout":
      case "error":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status?.status) {
      case "available":
        return "YFinance: Ready";
      case "not_available":
        return "YFinance: Setup Required";
      case "timeout":
        return "YFinance: Timeout";
      case "error":
        return "YFinance: Error";
      default:
        return "YFinance: Checking...";
    }
  };

  const getStatusColor = () => {
    switch (status?.status) {
      case "available":
        return "text-green-600";
      case "not_available":
      case "timeout":
      case "error":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (status?.status === "available") {
    return (
      <div className="flex items-center space-x-2 text-sm">
        {getStatusIcon()}
        <span className={getStatusColor()}>{getStatusText()}</span>
        {lastChecked && (
          <span className="text-gray-400 text-xs">
            (checked {lastChecked.toLocaleTimeString()})
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={getStatusColor()}>{getStatusText()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRetryAttempts(0);
              checkStatus().catch(console.error);
            }}
            disabled={loading}
            className="ml-auto"
            title="Refresh YFinance status"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {status?.error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {status.error}
            </AlertDescription>
          </Alert>
        )}

        {status?.output && status.output.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Diagnostic Output:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {status.output.join("\n")}
            </pre>
          </div>
        )}

        {status?.setup_instructions && (
          <div>
            <h4 className="font-medium mb-2">Setup Instructions:</h4>
            <div className="bg-blue-50 p-3 rounded">
              {status.setup_instructions.map((instruction, index) => (
                <div key={index} className="text-sm">
                  {instruction.includes("pip install") ||
                  instruction.includes("uv add") ? (
                    <code className="bg-gray-200 px-2 py-1 rounded font-mono">
                      {instruction}
                    </code>
                  ) : (
                    <span>{instruction}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>What is YFinance?</strong>
          </p>
          <p>
            YFinance provides real-time financial data, stock quotes, market
            news, and sentiment analysis. When properly configured, it enhances
            the application with live market data.
          </p>
        </div>

        {lastChecked && (
          <div className="text-xs text-gray-400">
            Last checked: {lastChecked.toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default YFinanceSetupStatus;
