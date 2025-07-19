import React from "react";
import { StockChannelHub } from "../social/StockChannelHub";

export const ChatInterface: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* AI Prompt Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🧠 AI Prompt: Build Stock Channel Hub (Inspired by Crypto Channels UI)
        </h2>

        <blockquote className="border-l-4 border-blue-500 pl-4 mb-4">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            <strong>Prompt:</strong>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You are an expert frontend and UX engineer. Build a{" "}
            <strong>Stock Channel Hub</strong> interface styled after a
            Reddit/Discord hybrid. It should be modeled after crypto-only
            channels (like in the screenshot), but designed specifically for{" "}
            <strong>U.S. stock tickers</strong>.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The UI should support <strong>real-time message threads</strong>,{" "}
            <strong>ticker-based channel navigation</strong>, and{" "}
            <strong>live stock data integration</strong>.
          </p>
        </blockquote>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🎯 Component Requirements:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600 dark:text-blue-400">
                  1. Left Sidebar – Stock Channels
                </h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>
                    • Title: <strong>Stock Channels</strong>
                  </li>
                  <li>
                    • Show scrollable list with $TICKER (e.g., $TSLA, $AAPL)
                  </li>
                  <li>• Company name + Price + % daily change</li>
                  <li>• 🟢 or 🔴 sentiment indicators</li>
                  <li>
                    • Live mention and engagement counts (💬 15,420 | 👍 1,847)
                  </li>
                  <li>• Click-to-switch between channels + search bar</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-green-600 dark:text-green-400">
                  2. Main Feed – Ticker Chatroom (e.g., $TSLA)
                </h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• Header: Large ticker symbol + company name</li>
                  <li>• Current price + % daily movement</li>
                  <li>
                    • Description: "Discuss $TSLA trades, news, and analysis"
                  </li>
                  <li>• Rules bar: "Use cashtags | No spam | Quality ideas"</li>
                  <li>
                    • Message components with sentiment labels (📈 Bullish)
                  </li>
                  <li>• Badges: Verified | Analyst | Diamond Hands</li>
                  <li>• Interaction buttons: 👍 Like | 💬 Comment | 📌 Pin</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-2">
              3. Right Sidebar (Optional)
            </h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4 text-sm">
              <li>• Trending Tickers Today</li>
              <li>• Top Posters in $TICKER channel</li>
              <li>• Sentiment breakdown: % Bullish / Bearish</li>
              <li>• "Hot Takes" – Top 3 most liked messages today</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">
              🧪 Advanced Features (Optional):
            </h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4 text-sm">
              <li>• Hover-over on $TICKER gives mini chart</li>
              <li>• Emoji badge voting (🧠 Smart | 🚀 Moon | ⚠️ Risky)</li>
              <li>• Leaderboards: Most Liked Poster, Most Accurate Calls</li>
              <li>• Alert bell for price or sentiment spikes</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-600 dark:text-gray-400 mb-2">
              🎨 Style Guide:
            </h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4 text-sm">
              <li>
                • Match <strong>MoorMeter dashboard theme</strong>
              </li>
              <li>• Dark mode default (deep navy or slate)</li>
              <li>• Rounded cards, shadowed chat bubbles</li>
              <li>• Channel highlight state in purple or blue</li>
              <li>• Reuse design elements from crypto UI for brand cohesion</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2">
              🛠️ Tech Stack Suggestion:
            </h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4 text-sm">
              <li>
                • <strong>Frontend</strong>: React + TailwindCSS
              </li>
              <li>
                • <strong>Backend</strong>: Firebase or Supabase (for real-time
                messaging)
              </li>
              <li>
                • <strong>Ticker Data</strong>: Polygon.io or Alpha Vantage API
              </li>
              <li>
                • <strong>Authentication</strong>: Firebase Auth
              </li>
              <li>
                • <strong>Emoji & Markdown Support</strong>: react-markdown +
                emoji-mart
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stock Channel Hub Implementation */}
      <StockChannelHub />
    </div>
  );
};
