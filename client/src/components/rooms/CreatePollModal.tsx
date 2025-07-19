import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  BarChart3,
  Clock,
  TrendingUp,
  TrendingDown,
  Hash,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import { StockTwistPoll, PollOption } from "@/types/rooms";

interface CreatePollModalProps {
  onCreatePoll: (pollData: StockTwistPoll) => void;
  userId: string;
  username: string;
}

const pollTemplates = [
  {
    name: "Ticker Performance",
    question: "Which stock will perform best this week?",
    options: ["NVDA", "TSLA", "AAPL", "MSFT"],
    type: "ticker",
  },
  {
    name: "Market Direction",
    question: "Where do you think the S&P 500 is heading?",
    options: ["🚀 Bull Run", "📈 Gradual Up", "📊 Sideways", "📉 Correction"],
    type: "sentiment",
  },
  {
    name: "Sector Play",
    question: "Which sector will outperform next month?",
    options: ["Technology", "Healthcare", "Energy", "Financials"],
    type: "sector",
  },
  {
    name: "Earnings Play",
    question: "Best earnings play for this quarter?",
    options: ["NVDA", "GOOGL", "AMZN", "META"],
    type: "ticker",
  },
];

export const CreatePollModal: React.FC<CreatePollModalProps> = ({
  onCreatePoll,
  userId,
  username,
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [duration, setDuration] = useState("24"); // hours
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const handleTemplateSelect = (templateName: string) => {
    const template = pollTemplates.find((t) => t.name === templateName);
    if (template) {
      setQuestion(template.question);
      setOptions([...template.options]);
      setSelectedTemplate(templateName);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!question.trim() || options.filter((opt) => opt.trim()).length < 2)
      return;

    setIsCreating(true);

    const validOptions = options.filter((opt) => opt.trim());
    const pollOptions: PollOption[] = validOptions.map((option, index) => ({
      id: `option-${index + 1}`,
      text: option.trim(),
      ticker: option.startsWith("$") ? option.substring(1) : undefined,
      votes: 0,
      voters: [],
    }));

    const poll: StockTwistPoll = {
      id: `poll-${Date.now()}`,
      question: question.trim(),
      options: pollOptions,
      createdBy: userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + parseInt(duration) * 60 * 60 * 1000),
      totalVotes: 0,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onCreatePoll(poll);
    setIsCreating(false);

    // Reset form
    setQuestion("");
    setOptions(["", ""]);
    setDuration("24");
    setSelectedTemplate("");
  };

  const canCreate =
    question.trim() && options.filter((opt) => opt.trim()).length >= 2;

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Create StockTwist Poll
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Templates */}
        <div>
          <Label className="text-sm font-medium">Quick Templates</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pollTemplates.map((template) => (
              <Button
                key={template.name}
                variant={
                  selectedTemplate === template.name ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleTemplateSelect(template.name)}
                className="text-xs"
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="space-y-2">
          <Label htmlFor="question">Poll Question *</Label>
          <Textarea
            id="question"
            placeholder="e.g., Which stock will perform best this week?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[80px]"
            maxLength={200}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Make it engaging and specific</span>
            <span>{question.length}/200</span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Poll Options * (2-6 options)</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={options.length >= 6}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Option ${index + 1} (use $TICKER for stocks)`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    maxLength={50}
                  />
                  {option.startsWith("$") && (
                    <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {options.length > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            Tip: Use $TICKER format (e.g., $NVDA) for stock symbols to auto-link
            them
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Poll Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="6">6 hours</SelectItem>
              <SelectItem value="12">12 hours</SelectItem>
              <SelectItem value="24">24 hours</SelectItem>
              <SelectItem value="48">2 days</SelectItem>
              <SelectItem value="168">7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        {canCreate && (
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Poll Preview</span>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {duration}h
                  </Badge>
                </div>

                <div className="font-medium">{question}</div>

                <div className="space-y-2">
                  {options
                    .filter((opt) => opt.trim())
                    .map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-background rounded border"
                      >
                        <span className="text-sm">{option}</span>
                        <span className="text-xs text-muted-foreground">
                          0%
                        </span>
                      </div>
                    ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  0 votes • Expires in {duration} hours
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button
            onClick={handleCreatePoll}
            disabled={!canCreate || isCreating}
            className="min-w-[120px]"
          >
            {isCreating ? "Creating..." : "Create Poll"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
