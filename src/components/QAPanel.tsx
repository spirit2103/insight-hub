import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Source {
  document: string;
  page: number;
  snippet: string;
}

interface Answer {
  id: string;
  question: string;
  answer: string[];
  confidence: "high" | "medium" | "low";
  sources: Source[];
}

const sampleAnswers: Answer[] = [
  {
    id: "1",
    question: "What were the key financial highlights for 2024?",
    answer: [
      "Revenue increased by 23% year-over-year to $4.2 billion",
      "Operating margin improved to 18.5%, up from 15.2%",
      "Free cash flow generation of $890 million",
      "Return on invested capital (ROIC) of 14.2%",
    ],
    confidence: "high",
    sources: [
      { document: "Annual Report 2024.pdf", page: 12, snippet: "...total revenue reached $4.2 billion, representing a 23% increase..." },
      { document: "Annual Report 2024.pdf", page: 45, snippet: "...operating margin expanded 330 basis points to 18.5%..." },
    ],
  },
];

export function QAPanel() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<Answer[]>(sampleAnswers);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAnswer: Answer = {
      id: crypto.randomUUID(),
      question: question,
      answer: [
        "Based on the analyzed documents, the company has shown consistent growth",
        "Key initiatives include digital transformation and sustainability programs",
        "Management outlook remains positive for the upcoming fiscal year",
      ],
      confidence: "medium",
      sources: [
        { document: "Annual Report 2024.pdf", page: 8, snippet: "...strategic initiatives continue to drive sustainable growth..." },
      ],
    };
    
    setAnswers(prev => [newAnswer, ...prev]);
    setQuestion("");
    setIsLoading(false);
  };

  const getConfidenceColor = (confidence: Answer["confidence"]) => {
    switch (confidence) {
      case "high": return "text-success bg-success/10";
      case "medium": return "text-warning bg-warning/10";
      case "low": return "text-destructive bg-destructive/10";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Answers Section */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {answers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Ask a Question
              </h3>
              <p className="text-muted-foreground max-w-md">
                Query your uploaded documents using natural language. 
                Get answers with confidence scores and source citations.
              </p>
            </motion.div>
          ) : (
            answers.map((answer) => (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Question */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">Q</span>
                  </div>
                  <p className="text-foreground font-medium pt-1">{answer.question}</p>
                </div>

                {/* Answer */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Confidence Badge */}
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                      getConfidenceColor(answer.confidence)
                    )}>
                      {answer.confidence.charAt(0).toUpperCase() + answer.confidence.slice(1)} confidence
                    </div>

                    {/* Answer Points */}
                    <ul className="space-y-2">
                      {answer.answer.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    {/* Sources */}
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Sources
                      </p>
                      <div className="space-y-2">
                        {answer.sources.map((source, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-secondary/50 text-sm"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{source.document}</span>
                              <span className="text-muted-foreground">• Page {source.page}</span>
                            </div>
                            <p className="text-muted-foreground italic">"{source.snippet}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!question.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
