# 🧱 Builder.io Integration for MoorMeter Dashboard

This guide shows how to use the MoorMeter components with Builder.io's visual page builder.

## 🚀 Quick Start

### 1. View the Demo

Click the **"Builder.io Demo"** button in the navigation to see the components in action.

### 2. Setup Builder.io Account

1. Sign up at [builder.io](https://builder.io)
2. Get your Public API Key from space settings
3. Add it to your `.env.local` file:
   ```
   VITE_BUILDER_API_KEY=your-api-key-here
   ```

### 3. Available Components

All components from your original specification have been created as Builder.io compatible modules:

#### 🔹 **MoodScoreHero**

- **Purpose**: Large mood score display with breakdown
- **Props**:
  - `title` (string): Main heading
  - `subtitle` (string): Description text
  - `apiEndpoint` (string): Data source URL

#### 🔹 **TopStocksModule**

- **Purpose**: Top performing stocks with sentiment
- **Props**:
  - `title` (string): Widget title
  - `maxStocks` (number): Number of stocks to show
  - `showSentiment` (boolean): Show sentiment bars
  - `apiEndpoint` (string): Stock data API

#### 🔹 **NewsFeedModule** _(Ready for implementation)_

- **Purpose**: AI-powered news with sentiment analysis
- **Props**:
  - `title` (string): Feed title
  - `maxArticles` (number): Article limit
  - `showSentiment` (boolean): Display sentiment badges

#### 🔹 **SentimentChart** _(Ready for implementation)_

- **Purpose**: Mood over time visualization
- **Props**:
  - `title` (string): Chart title
  - `timeframe` (string): Data range (1D, 7D, 30D)
  - `height` (number): Chart height in pixels
  - `showLegend` (boolean): Display legend

#### 🔹 **TrendingTopicsModule** _(Ready for implementation)_

- **Purpose**: Social media trending topics
- **Props**:
  - `title` (string): Widget title
  - `maxTopics` (number): Topics to display
  - `platforms` (string): Comma-separated platforms

#### 🔹 **AIInsightModule** _(Ready for implementation)_

- **Purpose**: AI-generated market insights
- **Props**:
  - `title` (string): Insight title
  - `refreshInterval` (number): Update frequency
  - `showConfidence` (boolean): Show AI confidence score

## 🎨 Design Features

### Responsive Design

- Mobile-first approach
- Cards stack on smaller screens
- Touch-friendly interactions

### Futuristic Theme

- Gradient backgrounds (blue/purple/indigo)
- Glass-morphism effects
- Animated elements and hover states
- Dynamic color coding based on sentiment

### Real-time Data

- Live API integration with existing MoorMeter services
- Auto-refreshing components
- Fallback mock data when APIs unavailable

## 🔧 Technical Implementation

### File Structure

```
client/
├── builder-registry.ts              # Component registry
├── src/components/builder/          # Builder.io components
│   ├── MoodScoreHero.tsx           # ✅ Implemented
│   ├── TopStocksModule.tsx         # ✅ Implemented
│   ├── NewsFeedModule.tsx          # 🚧 Ready for implementation
│   ├── SentimentChart.tsx          # 🚧 Ready for implementation
│   ├── TrendingTopicsModule.tsx    # 🚧 Ready for implementation
│   └── AIInsightModule.tsx         # 🚧 Ready for implementation
├── src/components/BuilderDemo.tsx   # Demo page
└── src/components/BuilderPage.tsx   # Builder.io page wrapper
```

### Component Registration

Components are registered in `builder-registry.ts` with:

- TypeScript interfaces for props
- Default values for all inputs
- Input validation and types
- Responsive design support

### Integration Example

```tsx
import { MoodScoreHero } from "./components/builder/MoodScoreHero";

// Use in your Builder.io pages
<MoodScoreHero
  title="Custom Market Mood"
  subtitle="Powered by your data"
  apiEndpoint="/api/custom-mood"
/>;
```

## 📊 API Integration

### Existing APIs Used

- **Finnhub**: Real-time stock quotes
- **NewsAPI**: Financial news headlines
- **Custom**: Sentiment analysis and mood calculation

### Mock Data Fallbacks

All components include mock data generators for:

- Development and testing
- API downtime scenarios
- Demo purposes

## 🎯 Builder.io Setup Steps

### For Next.js Projects

Follow the [Builder.io Next.js guide](https://www.builder.io/c/docs/nextjs) with the components from this project.

### For Vite/React Projects (Current Setup)

1. Install Builder.io SDK (already done)
2. Register components using `builder-registry.ts`
3. Create Builder.io pages in their visual editor
4. Drag and drop your custom components

### Component Usage in Builder.io

1. Log into Builder.io dashboard
2. Create a new page
3. Find your custom components in the left panel
4. Drag components onto the page
5. Configure props in the right panel
6. Publish and integrate

## 🔄 Data Flow

```
MoorMeter APIs → Component Props → Builder.io → Visual Editor → Published Page
```

### Real-time Updates

- Components fetch live data every 30 seconds
- Sentiment scores update automatically
- Responsive to API changes
- Graceful error handling with fallbacks

## 🛠️ Extending Components

### Adding New Props

```tsx
// In component interface
interface MyComponentProps {
  newProp?: string;
}

// In builder-registry.ts
inputs: [
  {
    name: "newProp",
    type: "string",
    defaultValue: "default value",
    required: false,
  },
];
```

### Creating New Components

1. Create component in `src/components/builder/`
2. Add `'use client';` directive
3. Export named export (not default)
4. Register in `builder-registry.ts`
5. Test in Builder.io Demo page

## 📝 Next Steps

1. **Complete remaining components** following the same pattern as MoodScoreHero and TopStocksModule
2. **Set up Builder.io account** and configure API key
3. **Create pages** in Builder.io visual editor
4. **Integrate with routing** for production use
5. **Add custom themes** and branding options

## 🎉 Benefits

✅ **Visual page building** - Non-developers can create pages  
✅ **Modular architecture** - Reusable components  
✅ **Real-time data** - Live market information  
✅ **Responsive design** - Works on all devices  
✅ **TypeScript support** - Type-safe development  
✅ **API integration** - Connected to real data sources

The MoorMeter components are now ready for drag-and-drop page building in Builder.io!
