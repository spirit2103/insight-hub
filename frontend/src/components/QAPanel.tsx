import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { askQuestion } from "@/lib/api"; // Import the askQuestion API function
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components

interface Source {
  documentName: string; // Renamed from 'document' to match backend
  pageNumber?: number; // Renamed from 'page' to match backend
  snippet: string;
}

interface Answer {
  id: string;
  question: string;
  answer: string; // Backend returns a single string
  confidence: "high" | "medium" | "low";
  evidence: Source[]; // Renamed from 'sources' to match backend
}

// Interface for documents passed from Dashboard
interface Document {
  id: string;
  fileName: string;
  status: string;
}

interface QAPanelProps {
  documents: Document[];
}

export function QAPanel({ documents }: QAPanelProps) {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || !selectedDocumentId) return;

    setIsLoading(true);

    try {
      const response = await askQuestion(question, selectedDocumentId);
      const newAnswer: Answer = {
        id: crypto.randomUUID(), // Client-side ID for UI keying
        question: question,
        answer: response.answer, // Backend returns a single string
        confidence: response.confidence,
        evidence: response.evidence.map((src: any) => ({
          documentName: src.documentName,
          pageNumber: src.pageNumber,
          snippet: src.snippet,
        })),
      };

      setAnswers(prev => [newAnswer, ...prev]);
      setQuestion("");
    } catch (error) {
      console.error("Error asking question:", error);
      const errorAnswer: Answer = {
        id: crypto.randomUUID(),
        question: question,
        answer: "Failed to get an answer. Please try again or check your document processing status.",
        confidence: "low",
        evidence: [],
      };
      setAnswers(prev => [errorAnswer, ...prev]);
    } finally {
      setIsLoading(false);
    }
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
                    <p className="text-foreground whitespace-pre-wrap">{answer.answer}</p>

                    {/* Sources */}
                    {answer.evidence && answer.evidence.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          Sources
                        </p>
                        <div className="space-y-2">
                          {answer.evidence.map((source, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-secondary/50 text-sm"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-foreground">{source.documentName}</span>
                                {source.pageNumber && <span className="text-muted-foreground">• Page {source.pageNumber}</span>}
                              </div>
                              <p className="text-muted-foreground italic">"{source.snippet}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center gap-3 mb-4">
          <Select onValueChange={setSelectedDocumentId} value={selectedDocumentId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Document" />
            </SelectTrigger>
            <SelectContent>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id} disabled={doc.status !== "completed"}>
                    {doc.fileName} {doc.status !== "completed" && `(${doc.status})`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-docs" disabled>
                  No documents available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedDocumentId && documents.find(d => d.id === selectedDocumentId)?.status !== "completed" && (
            <p className="text-sm text-destructive-foreground">Document not ready for Q&A.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1"
            disabled={isLoading || !selectedDocumentId || documents.find(d => d.id === selectedDocumentId)?.status !== "completed"}
          />
          <Button type="submit" disabled={!question.trim() || isLoading || !selectedDocumentId || documents.find(d => d.id === selectedDocumentId)?.status !== "completed"}>
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
