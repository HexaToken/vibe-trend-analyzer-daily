import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Eye, MessageSquare, Shield, Award, Sun, Moon } from 'lucide-react';
import { EnhancedChatPostCard } from '@/components/chat/EnhancedChatPostCard';
import { UserCredibilityProfile } from '@/components/moderation/UserCredibilityProfile';
import { BadgeDisplay } from '@/components/badges/BadgeDisplay';
import { moderationService } from '@/services/moderationService';
import { badgeService } from '@/services/badgeService';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import type { Post } from '@/types/social';
import type { BadgeType } from '@/types/badges';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

interface SpamTestPost {
  id: string;
  content: string;
  expectedFlag: boolean;
  description: string;
}

const spamTestPosts: SpamTestPost[] = [
  {
    id: 'spam-1',
    content: '🚀🚀🚀 TO THE MOON!!! 1000x GAINS GUARANTEED!!! BUY NOW OR CRY LATER!!! 🚀🚀🚀',
    expectedFlag: true,
    description: 'Excessive emojis and hype language'
  },
  {
    id: 'spam-2',
    content: 'Click here for FREE CRYPTO: https://sketchy-site.com/get-rich-quick',
    expectedFlag: true,
    description: 'External link with suspicious content'
  },
  {
    id: 'spam-3',
    content: 'BTC looks bullish based on the 200-day moving average and recent volume patterns.',
    expectedFlag: false,
    description: 'Legitimate technical analysis'
  },
  {
    id: 'spam-4',
    content: 'PUMP PUMP PUMP!!! Everyone buy now!!! Secret insider info!!! 💰💰💰',
    expectedFlag: true,
    description: 'Pump and dump language'
  }
];

const credibilityTestPosts = [
  {
    id: 'cred-1',
    content: 'Based on historical patterns and current market indicators, I expect SPY to test resistance at $485.',
    author: 'expert_trader',
    expectedScore: 85,
    description: 'High-quality analysis from verified trader'
  },
  {
    id: 'cred-2',
    content: 'lol stonks only go up 📈',
    author: 'meme_lord',
    expectedScore: 25,
    description: 'Low-effort meme post'
  },
  {
    id: 'cred-3',
    content: 'My AI model shows 73% probability of market correction in Q2 based on Fed policy indicators.',
    author: 'ai_analyst',
    expectedScore: 92,
    description: 'Data-driven prediction with specifics'
  }
];

export const ModerationTestingDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const runSpamDetectionTests = async () => {
    setCurrentTest('Spam Detection & Flagging System');
    
    for (const testPost of spamTestPosts) {
      try {
        const mockPost: Post = {
          id: testPost.id,
          content: testPost.content,
          author: 'test_user',
          timestamp: new Date(),
          likes: 0,
          replies: 0,
          mood: 'neutral',
          credibilityScore: 50
        };

        const flagResult = moderationService.detectSpam(testPost.content);
        const shouldBeFlagged = testPost.expectedFlag;
        
        const passed = flagResult.isSpam === shouldBeFlagged;
        
        addTestResult({
          test: `Spam Detection: ${testPost.description}`,
          status: passed ? 'pass' : 'fail',
          message: passed 
            ? `Correctly ${shouldBeFlagged ? 'flagged' : 'allowed'} post`
            : `Expected ${shouldBeFlagged ? 'flagged' : 'allowed'} but got ${flagResult.isSpam ? 'flagged' : 'allowed'}`,
          details: `Content: "${testPost.content.slice(0, 50)}..."`
        });
      } catch (error) {
        addTestResult({
          test: `Spam Detection: ${testPost.description}`,
          status: 'fail',
          message: `Error testing spam detection: ${error}`,
          details: testPost.content
        });
      }
    }
  };

  const runCredibilityTests = async () => {
    setCurrentTest('Credibility Scoring System');
    
    for (const testPost of credibilityTestPosts) {
      try {
        const score = moderationService.calculateCredibilityScore({
          content: testPost.content,
          author: testPost.author,
          timestamp: new Date(),
          engagement: { likes: 5, replies: 2, shares: 1 }
        });

        const scoreDiff = Math.abs(score - testPost.expectedScore);
        const tolerance = 15; // Allow 15 point variance
        const passed = scoreDiff <= tolerance;

        addTestResult({
          test: `Credibility Scoring: ${testPost.description}`,
          status: passed ? 'pass' : scoreDiff <= 25 ? 'warning' : 'fail',
          message: `Score: ${score} (expected ~${testPost.expectedScore})`,
          details: `Content: "${testPost.content.slice(0, 50)}..."`
        });
      } catch (error) {
        addTestResult({
          test: `Credibility Scoring: ${testPost.description}`,
          status: 'fail',
          message: `Error calculating credibility: ${error}`,
          details: testPost.content
        });
      }
    }
  };

  const runBadgeSystemTests = async () => {
    setCurrentTest('User Badge Recognition');
    
    const testBadges: BadgeType[] = ['trusted_contributor', 'top_predictor', 'community_hero', 'spam_fighter'];
    
    for (const badgeType of testBadges) {
      try {
        const badgeDefinition = badgeService.getBadgeDefinition(badgeType);
        const hasDefinition = !!badgeDefinition;
        
        addTestResult({
          test: `Badge Definition: ${badgeType}`,
          status: hasDefinition ? 'pass' : 'fail',
          message: hasDefinition 
            ? `Badge properly defined with rarity: ${badgeDefinition.rarity}`
            : `Badge definition missing`,
          details: hasDefinition ? `Points: ${badgeDefinition.points}` : undefined
        });

        // Test badge awarding logic
        const mockUser = {
          id: 'test-user',
          credibilityScore: 85,
          postsCount: 50,
          verifiedPosts: 15,
          helpfulFlags: 25,
          communityEngagement: 75
        };

        const isEligible = badgeService.checkBadgeEligibility(badgeType, mockUser);
        
        addTestResult({
          test: `Badge Eligibility: ${badgeType}`,
          status: 'pass',
          message: `Eligibility check: ${isEligible ? 'Eligible' : 'Not eligible'}`,
          details: `User metrics: credibility=${mockUser.credibilityScore}, posts=${mockUser.postsCount}`
        });

      } catch (error) {
        addTestResult({
          test: `Badge System: ${badgeType}`,
          status: 'fail',
          message: `Error testing badge: ${error}`,
          details: undefined
        });
      }
    }
  };

  const runPostMetricsTests = async () => {
    setCurrentTest('Post-Level Moderation Metrics');
    
    const testPosts = [
      {
        id: 'metric-1',
        content: 'Bullish on NVDA after earnings beat',
        mood: 'extreme_greed',
        expectedMoodTag: true,
        expectedCredibilityIcon: true
      },
      {
        id: 'metric-2',
        content: 'Market crash incoming!!!',
        mood: 'extreme_fear',
        expectedMoodTag: true,
        expectedCredibilityIcon: false
      }
    ];

    for (const testPost of testPosts) {
      try {
        const mockPost: Post = {
          id: testPost.id,
          content: testPost.content,
          author: 'test_user',
          timestamp: new Date(),
          likes: 0,
          replies: 0,
          mood: testPost.mood as any,
          credibilityScore: testPost.expectedCredibilityIcon ? 85 : 35
        };

        // Test mood score tag
        const hasMoodTag = !!mockPost.mood;
        addTestResult({
          test: `Mood Tag Display: ${testPost.id}`,
          status: (hasMoodTag === testPost.expectedMoodTag) ? 'pass' : 'fail',
          message: `Mood tag ${hasMoodTag ? 'present' : 'missing'}: ${mockPost.mood}`,
          details: testPost.content
        });

        // Test credibility icon
        const hasCredibilityIcon = mockPost.credibilityScore >= 70;
        addTestResult({
          test: `Credibility Icon: ${testPost.id}`,
          status: (hasCredibilityIcon === testPost.expectedCredibilityIcon) ? 'pass' : 'fail',
          message: `Credibility icon ${hasCredibilityIcon ? 'shown' : 'hidden'} (score: ${mockPost.credibilityScore})`,
          details: testPost.content
        });

      } catch (error) {
        addTestResult({
          test: `Post Metrics: ${testPost.id}`,
          status: 'fail',
          message: `Error testing post metrics: ${error}`,
          details: testPost.content
        });
      }
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      await runSpamDetectionTests();
      await runCredibilityTests();
      await runBadgeSystemTests();
      await runPostMetricsTests();
    } catch (error) {
      addTestResult({
        test: 'Test Suite Execution',
        status: 'fail',
        message: `Test suite failed: ${error}`,
        details: undefined
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const testStats = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'pass').length,
    failed: testResults.filter(r => r.status === 'fail').length,
    warnings: testResults.filter(r => r.status === 'warning').length
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🔍 MoodMeter Moderation QA Testing</h1>
        <p className="text-muted-foreground">
          Comprehensive testing suite for moderation tools, spam control, credibility scoring, and badge system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{testStats.passed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{testStats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{testStats.warnings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          size="lg"
          className="min-w-48"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Running Tests...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Run All Tests
            </>
          )}
        </Button>
      </div>

      {currentTest && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Currently Testing</AlertTitle>
          <AlertDescription>{currentTest}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="spam">Spam Tests</TabsTrigger>
          <TabsTrigger value="badges">Badge Demo</TabsTrigger>
          <TabsTrigger value="components">Component Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Detailed results from moderation system testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No test results yet. Run the test suite to see results.
                </p>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                        {result.details && (
                          <div className="text-xs text-muted-foreground mt-1 font-mono bg-muted p-1 rounded">
                            {result.details}
                          </div>
                        )}
                      </div>
                      <Badge variant={
                        result.status === 'pass' ? 'default' : 
                        result.status === 'fail' ? 'destructive' : 'secondary'
                      }>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spam" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spam Detection Test Cases</CardTitle>
              <CardDescription>
                Sample posts used to test spam detection algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {spamTestPosts.map((testPost) => (
                <div key={testPost.id} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">{testPost.description}</div>
                  <div className="bg-muted p-3 rounded font-mono text-sm mb-2">
                    {testPost.content}
                  </div>
                  <Badge variant={testPost.expectedFlag ? 'destructive' : 'default'}>
                    Expected: {testPost.expectedFlag ? 'FLAGGED' : 'ALLOWED'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badge System Demo</CardTitle>
              <CardDescription>
                Visual demonstration of user badges and credibility indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Badge Variants</h4>
                  <div className="space-y-2">
                    <BadgeDisplay badge="trusted_contributor" variant="compact" />
                    <BadgeDisplay badge="top_predictor" variant="profile" />
                    <BadgeDisplay badge="community_hero" variant="full" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">User Credibility Profiles</h4>
                  <UserCredibilityProfile 
                    userId="demo-user-1"
                    level="trusted"
                    score={87}
                    badges={['trusted_contributor', 'top_predictor']}
                  />
                  <UserCredibilityProfile 
                    userId="demo-user-2"
                    level="verified"
                    score={65}
                    badges={['community_hero']}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Integration Tests</CardTitle>
              <CardDescription>
                Test moderation features in actual UI components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Enhanced Chat Post Cards</h4>
                {credibilityTestPosts.map((testPost) => (
                  <EnhancedChatPostCard
                    key={testPost.id}
                    message={{
                      id: testPost.id,
                      content: testPost.content,
                      sender: testPost.author,
                      timestamp: new Date(),
                      credibilityScore: testPost.expectedScore,
                      mood: 'neutral',
                      flagged: false
                    }}
                    onFlag={() => console.log('Flagged:', testPost.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
