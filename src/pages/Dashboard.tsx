import { motion } from "framer-motion";
import { 
  FileText, 
  Upload, 
  BarChart3, 
  MessageSquareText,
  Plus,
  TrendingUp,
  Clock
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { DocumentUpload } from "@/components/DocumentUpload";
import { MetadataCard, sampleMetadata } from "@/components/MetadataCard";
import { InsightsCharts } from "@/components/InsightsCharts";
import { QAPanel } from "@/components/QAPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stats = [
  { label: "Documents", value: "12", icon: FileText, color: "chart-1" },
  { label: "Processing", value: "2", icon: Clock, color: "chart-3" },
  { label: "Insights", value: "156", icon: TrendingUp, color: "chart-2" },
  { label: "Questions Asked", value: "48", icon: MessageSquareText, color: "chart-4" },
];

const recentDocuments = [
  { name: "Annual Report 2024.pdf", status: "completed", pages: 142, date: "2 hours ago" },
  { name: "Q3 Financial Statement.pdf", status: "processing", pages: 28, date: "4 hours ago" },
  { name: "Industry Analysis.docx", status: "completed", pages: 45, date: "1 day ago" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Research Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Upload documents and extract insights with AI
            </p>
          </div>
          <Button variant="hero">
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="qa" className="gap-2">
              <MessageSquareText className="w-4 h-4" />
              Q&A
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Upload Documents</h2>
                <DocumentUpload />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h2>
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.pages} pages • {doc.date}
                        </p>
                      </div>
                      <div className={`status-badge status-${doc.status}`}>
                        {doc.status === "completed" ? "Ready" : "Processing"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <MetadataCard 
                documentName="Annual Report 2024.pdf"
                metadata={sampleMetadata}
                onSave={(key, value) => console.log("Saving", key, value)}
              />
              <MetadataCard 
                documentName="Industry Analysis.docx"
                metadata={[
                  { key: "company", label: "Industry", value: "Technology", icon: sampleMetadata[0].icon, editable: true },
                  { key: "year", label: "Document Year", value: "2024", icon: sampleMetadata[1].icon, editable: true },
                  { key: "type", label: "Document Type", value: "Research Report", icon: sampleMetadata[3].icon },
                  { key: "pages", label: "Pages", value: "45", icon: sampleMetadata[4].icon },
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <InsightsCharts />
          </TabsContent>

          <TabsContent value="qa" className="h-[600px] -mx-6 lg:-mx-8">
            <div className="h-full border-t border-border">
              <QAPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
