import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, PieChartIcon, BarChart3 } from "lucide-react";

const topicData = [
  { topic: "Financial Performance", count: 45 },
  { topic: "Market Analysis", count: 38 },
  { topic: "Risk Factors", count: 32 },
  { topic: "Corporate Strategy", count: 28 },
  { topic: "ESG Initiatives", count: 22 },
  { topic: "Innovation", count: 18 },
];

const sentimentData = [
  { name: "Positive", value: 58, color: "hsl(160, 84%, 39%)" },
  { name: "Neutral", value: 32, color: "hsl(215, 20%, 65%)" },
  { name: "Negative", value: 10, color: "hsl(0, 72%, 51%)" },
];

const mentionsData = [
  { month: "Jan", mentions: 12 },
  { month: "Feb", mentions: 19 },
  { month: "Mar", mentions: 15 },
  { month: "Apr", mentions: 28 },
  { month: "May", mentions: 24 },
  { month: "Jun", mentions: 32 },
];

export function InsightsCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Topic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-chart-1" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Topic Distribution</h3>
            <p className="text-sm text-muted-foreground">Key themes identified in documents</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis 
                dataKey="topic" 
                type="category" 
                width={120}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Sentiment Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-chart-3" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">Overall document tone</p>
          </div>
        </div>
        
        <div className="h-64 flex items-center">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium text-foreground ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mentions Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2 p-5 rounded-xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Key Term Mentions Over Time</h3>
            <p className="text-sm text-muted-foreground">Tracking "sustainability" mentions across documents</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mentionsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mentions" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--chart-2))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
