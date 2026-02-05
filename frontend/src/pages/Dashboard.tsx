import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  BarChart3,
  MessageSquareText,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { DocumentUpload } from "@/components/DocumentUpload";
import { MetadataCard } from "@/components/MetadataCard";
import { InsightsCharts } from "@/components/InsightsCharts";
import { QAPanel } from "@/components/QAPanel";
import { Button } from "@/components/ui/button";
import { deleteDocument } from "@/lib/api";
import {
  fetchDocuments,
  fetchMetadata,
  fetchChartsData,
} from "@/lib/api"; // Import API functions
import { useAuth } from "@/hooks/use-auth"; // Assuming you have an auth hook for user state

// Define interfaces for data fetched from backend
interface Document {
  id: string;
  fileName: string;
  status: string;
  uploadDate: { _seconds: number; _nanoseconds: number };
  metadata?: {
    companyName?: string;
    year?: number;
  };
  sizeBytes?: number | null;
  pageCount?: number | null;
  chunkCount?: number | null;
  companyNames?: string[];
  docYear?: number | null;
  ownerId?: string | null;
}

interface Stats {
  totalDocuments: number;
  companiesMentioned: number;
  avgDocumentYear: number;
  mostRecentUpload: string | null;
}

interface ChartData {
  keywordFrequency: { keyword: string; count: number }[];
  mentionsOverTime: { year: number; mentions: number }[];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upload");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get user from auth context

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const loadDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return; // Do not fetch if user is not authenticated
    }
    setLoading(true);
    setError(null);
    try {
      const [docs, metadata, charts] = await Promise.all([
        fetchDocuments(),
        fetchMetadata(),
        fetchChartsData(),
      ]);
      setDocuments(docs);
      setStats(metadata);
      setChartData(charts);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]); // Reload data when user state changes

  useEffect(() => {
    if (!documents.length) return;
    const hasProcessing = documents.some((doc) => doc.status === "processing");
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, [documents, user]);

  const displayStats = stats ? [
    { label: "Total Documents", value: stats.totalDocuments.toString(), icon: FileText, color: "chart-1" },
    { label: "Companies Mentioned", value: stats.companiesMentioned.toString(), icon: Clock, color: "chart-3" }, // Re-using Clock icon as a placeholder
    { label: "Avg. Doc Year", value: stats.avgDocumentYear.toFixed(1), icon: TrendingUp, color: "chart-2" }, // Re-using TrendingUp
    { label: "Recent Upload", value: stats.mostRecentUpload ? new Date(stats.mostRecentUpload).toLocaleDateString() : 'N/A', icon: MessageSquareText, color: "chart-4" }, // Re-using MessageSquareText
  ] : [];


  const renderTabContent = () => {
    if (loading) {
      return <div>Loading dashboard data...</div>;
    }
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

    // Dummy data for MetadataCard for now, will be updated when we implement document selection
    const sampleMetadataForCard = [
      { key: "company", label: "Company", value: "N/A", icon: FileText, editable: true },
      { key: "year", label: "Year", value: "N/A", icon: Clock, editable: true },
    ];

    switch (activeTab) {
      case "upload":
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Upload Documents</h2>
              <DocumentUpload onUploadSuccess={loadDashboardData} /> {/* Pass callback to refresh data */}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h2>
              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {doc.status} • Uploaded:
                          {new Date(doc.uploadDate._seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`status-badge status-${doc.status}`}>
                        {doc.status === "completed" ? "Ready" : "Processing"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No documents uploaded yet.</p>
                )}
              </div>
            </div>
          </div>
        );
      case "documents":
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id}>
                  <MetadataCard
                    documentName={doc.fileName}
                    // Dynamically construct metadata props from fetched document
                    metadata={[
                      { key: "status", label: "Status", value: doc.status, icon: FileText },
                      { key: "uploadDate", label: "Upload Date", value: new Date(doc.uploadDate._seconds * 1000).toLocaleDateString(), icon: Clock },
                      { key: "pages", label: "Pages", value: doc.pageCount ? doc.pageCount.toString() : "—", icon: FileText },
                      { key: "size", label: "Total Size", value: doc.sizeBytes ? formatBytes(doc.sizeBytes) : "—", icon: FileText },
                      { key: "chunks", label: "Chunks", value: doc.chunkCount ? doc.chunkCount.toString() : "—", icon: FileText },
                      { key: "companies", label: "Company", value: doc.companyNames && doc.companyNames.length > 0 ? doc.companyNames.join(", ") : "—", icon: FileText },
                      { key: "owner", label: "Owner", value: doc.ownerId || "—", icon: FileText },
                      { key: "year", label: "Doc Year", value: doc.docYear ? doc.docYear.toString() : "—", icon: Clock },
                      // Add other relevant metadata fields from your backend response
                    ]}
                    onSave={(key, value) => console.log("Saving", key, value)}
                  />
                  <div className="flex justify-end -mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          await deleteDocument(doc.id);
                          await loadDashboardData();
                        } catch (err) {
                          console.error("Failed to delete document:", err);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No documents to display metadata for.</p>
            )}
          </div>
        );
      case "insights":
        return <InsightsCharts chartData={chartData} />;
      case "qa":
        return (
          <div className="h-[600px] -mx-6 lg:-mx-8">
            <div className="h-full border-t border-border">
              <QAPanel documents={documents} /> {/* Pass documents to QAPanel */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Research Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Upload documents and extract insights with AI
            </p>
          </div>
          <Button
            variant="hero"
            onClick={() => {
              setActiveTab("upload");
              setTimeout(() => {
                document.getElementById("document-upload-input")?.click();
              }, 0);
            }}
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => (
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

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
