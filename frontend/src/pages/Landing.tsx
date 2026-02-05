import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Upload, 
  Brain, 
  MessageSquareText, 
  FileText, 
  BarChart3, 
  Shield,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const features = [
  {
    icon: Upload,
    title: "Upload Documents",
    description: "Drag and drop PDFs, DOCX files, and scanned documents. We handle the extraction.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Our RAG system extracts entities, topics, and insights from your documents.",
  },
  {
    icon: MessageSquareText,
    title: "Ask Questions",
    description: "Query your documents in natural language with source-attributed answers.",
  },
];

const capabilities = [
  "Automatic metadata extraction",
  "Topic and keyword distribution charts",
  "Cross-document search",
  "Confidence scores on AI answers",
  "Source citations with page numbers",
  "Batch document processing",
];

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Upload company reports, filings, or industry documents",
  },
  {
    number: "02",
    title: "Analyze",
    description: "AI extracts text, metadata, and creates searchable embeddings",
  },
  {
    number: "03",
    title: "Question",
    description: "Ask questions and get answers with evidence from your documents",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-subtle">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Document Research
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Extract Intelligence from{" "}
              <span className="text-accent">Your Documents</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Upload company filings, industry reports, and research documents. 
              Our AI extracts insights, visualizes data, and answers your questions 
              with full source attribution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Analyzing Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/signin">Sign In to Dashboard</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-xl border border-border bg-card shadow-panel overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-10 bg-secondary flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="pt-10 p-6 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                    <FileText className="w-10 h-10 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Annual Report 2024.pdf</p>
                      <p className="text-sm text-muted-foreground">Processing complete • 142 pages</p>
                    </div>
                    <div className="ml-auto status-badge status-completed">
                      <CheckCircle2 className="w-3 h-3" />
                      Ready
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground mb-1">Company</p>
                      <p className="font-medium text-foreground">Acme Corporation</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground mb-1">Document Year</p>
                      <p className="font-medium text-foreground">2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex-1 p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <BarChart3 className="w-6 h-6 text-accent mb-2" />
                    <p className="text-sm font-medium text-foreground">Topic Distribution</p>
                    <p className="text-xs text-muted-foreground">12 topics identified</p>
                  </div>
                  <div className="flex-1 p-4 rounded-lg bg-info/5 border border-info/20">
                    <MessageSquareText className="w-6 h-6 text-info mb-2" />
                    <p className="text-sm font-medium text-foreground">Q&A Ready</p>
                    <p className="text-xs text-muted-foreground">Ask questions now</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Research-Grade Document Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for analysts, researchers, and business professionals who need 
              reliable, explainable insights from their documents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-border bg-card card-interactive"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm text-foreground">{capability}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to unlock insights from your documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-sm text-primary-foreground/80">Secure & Private</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Research?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join researchers and analysts who trust DocuMind for document intelligence.
          </p>
          <Button 
            size="xl" 
            className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
            asChild
          >
            <Link to="/signup">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DocuMind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
