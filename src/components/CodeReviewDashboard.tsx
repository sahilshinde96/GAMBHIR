import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Code2, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw, 
  Upload,
  Sparkles,
  CheckCircle2,
  XCircle,
  Brain,
  Loader2
} from "lucide-react";

interface CodeReviewDashboardProps {
  onAuthClick: () => void;
}

export function CodeReviewDashboard({ onAuthClick }: CodeReviewDashboardProps) {
  const [code, setCode] = useState("");
  const [activeReview, setActiveReview] = useState<string | null>(null);
  const [reviewResults, setReviewResults] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const reviewOptions = [
    {
      id: "review",
      title: "AI Review",
      description: "Comprehensive code analysis and feedback",
      icon: Brain,
      variant: "review" as const,
      color: "text-primary"
    },
    {
      id: "errors",
      title: "Find Errors",
      description: "Detect bugs and potential issues",
      icon: XCircle,
      variant: "error" as const,
      color: "text-destructive"
    },
    {
      id: "improvements",
      title: "Improvements",
      description: "Optimize performance and readability",
      icon: Lightbulb,
      variant: "success" as const,
      color: "text-success"
    },
    {
      id: "refactor",
      title: "Refactor",
      description: "Restructure and modernize code",
      icon: RefreshCw,
      variant: "warning" as const,
      color: "text-warning"
    }
  ];

  const handleReviewAction = async (type: string) => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please paste your code before starting analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setActiveReview(type);
    setReviewResults("");

    try {
      const { data, error } = await supabase.functions.invoke('analyze-code', {
        body: {
          code: code.trim(),
          reviewType: type
        }
      });

      if (error) {
        console.error('Function error:', error);
        toast({
          title: "Analysis failed",
          description: "Failed to analyze your code. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.analysis) {
        setReviewResults(data.analysis);
        toast({
          title: "Analysis complete",
          description: `Your code ${type} analysis is ready.`,
        });
      } else {
        throw new Error('No analysis returned');
      }

    } catch (error) {
      console.error('Error analyzing code:', error);
      toast({
        title: "Analysis failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Code Reviewer</h1>
              <p className="text-sm text-muted-foreground">Intelligent code analysis powered by AI</p>
            </div>
          </div>
          <Button 
            variant="hero" 
            onClick={onAuthClick}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Code Input
                </CardTitle>
                <CardDescription>
                  Paste your code or upload a file for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Paste your code here..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-[300px] font-mono text-sm bg-code-bg border-code-border resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.php,.rb,.go,.rs"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </Button>
                  </label>
                  <Badge variant="outline" className="text-muted-foreground">
                    {code.length} characters
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Review Results */}
            {(activeReview && (reviewResults || isAnalyzing)) && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isAnalyzing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                    {isAnalyzing ? `Analyzing ${activeReview}...` : `Review Results - ${activeReview}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-code-bg border border-code-border rounded-lg p-4">
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p>Analyzing your code...</p>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">
                        {reviewResults}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Analysis
                </CardTitle>
                <CardDescription>
                  Choose your analysis type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviewOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.id}
                      variant={option.variant}
                      size="lg"
                      onClick={() => handleReviewAction(option.id)}
                      disabled={!code.trim() || isAnalyzing}
                      className="w-full justify-start h-auto p-4 group"
                    >
                      <div className="flex items-start gap-3 text-left">
                        {isAnalyzing && activeReview === option.id ? (
                          <Loader2 className="w-5 h-5 mt-0.5 animate-spin" />
                        ) : (
                          <Icon className={`w-5 h-5 mt-0.5 ${option.color} group-hover:text-current transition-colors`} />
                        )}
                        <div>
                          <div className="font-semibold">{option.title}</div>
                          <div className="text-xs opacity-90 font-normal">
                            {isAnalyzing && activeReview === option.id ? "Analyzing..." : option.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Today's Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">0</div>
                    <div className="text-sm text-muted-foreground">Issues Fixed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}