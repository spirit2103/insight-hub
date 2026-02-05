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
  AreaChart,
  Area,
  Treemap,
} from "recharts";
import { Sparkles, TrendingUp, BarChart3, ScanText, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartData {
  keywordFrequency: { keyword: string; count: number }[];
  mentionsOverTime: { year: number; mentions: number }[];
}

interface InsightsChartsProps {
  chartData: ChartData | null;
}

export function InsightsCharts({ chartData }: InsightsChartsProps) {
  // Using keywordFrequency for Topic Distribution
  const topicData =
    chartData?.keywordFrequency.map((item) => ({
      topic: item.keyword,
      count: item.count,
    })) || [];

  // Using mentionsOverTime for Key Term Mentions Over Time
  const mentionsData =
    chartData?.mentionsOverTime.map((item) => ({
      month: item.year.toString(),
      mentions: item.mentions,
    })) || [];

  const topKeywords = topicData.slice(0, 8);
  const totalMentions = mentionsData.reduce((sum, item) => sum + item.mentions, 0);
  const insightLevel =
    totalMentions > 20 ? "High signal" : totalMentions > 5 ? "Emerging signal" : "New signal";
  const palette = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--accent))",
  ];

  const totalKeywordCount = topKeywords.reduce((sum, item) => sum + item.count, 0);

  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    if (percent < 0.06) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    const label = topKeywords[index]?.topic;
    return (
      <text x={x} y={y} fill="hsl(var(--foreground))" fontSize={12} textAnchor="middle">
        {label}
      </text>
    );
  };

  return (
    <div className="insight-shell">
      <div className="insight-grid">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="insight-card insight-hero"
        >
          <div className="insight-headline">
            <div className="insight-badge">
              <Sparkles className="w-4 h-4" />
              Insight Canvas
            </div>
            <h3 className="insight-title">Signal summary</h3>
            <p className="insight-subtitle">
              A quick read on the strongest patterns in your document set.
            </p>
          </div>

          <div className="insight-metrics">
            <div className="insight-metric">
              <span className="insight-metric-label">Signal strength</span>
              <span className="insight-metric-value">{insightLevel}</span>
            </div>
            <div className="insight-metric">
              <span className="insight-metric-label">Total mentions</span>
              <span className="insight-metric-value">{totalMentions || 0}</span>
            </div>
            <div className="insight-metric">
              <span className="insight-metric-label">Top keywords</span>
              <span className="insight-metric-value">{topKeywords.length}</span>
            </div>
          </div>

          <div className="insight-chips">
            {topKeywords.length > 0 ? (
              topKeywords.map((item) => (
                <span key={item.topic} className="insight-chip">
                  {item.topic}
                </span>
              ))
            ) : (
              <span className="insight-empty">Upload a document to generate signals.</span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="insight-card"
        >
          <div className="insight-card-head">
            <div className="insight-icon">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="insight-card-title">Topic distribution</h4>
              <p className="insight-card-subtitle">Top themes from extracted chunks</p>
            </div>
          </div>

          <div className="insight-chart">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis
                    dataKey="topic"
                    type="category"
                    width={110}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="insight-empty">No topic data available yet.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="insight-card insight-wide"
        >
          <div className="insight-card-head">
            <div className="insight-icon insight-icon-alt">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="insight-card-title">Document activity</h4>
              <p className="insight-card-subtitle">Upload cadence and trendline</p>
            </div>
          </div>

          <div className="insight-chart">
            {mentionsData.length > 0 ? (
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
                      borderRadius: "12px",
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
            ) : (
              <div className="insight-empty">No activity data available yet.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className={cn("insight-card", topKeywords.length ? "insight-highlight" : "")}
        >
          <div className="insight-card-head">
            <div className="insight-icon insight-icon-warm">
              <ScanText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="insight-card-title">Reading focus</h4>
              <p className="insight-card-subtitle">Suggested themes to review</p>
            </div>
          </div>
          <div className="insight-focus">
            {topKeywords.length > 0 ? (
              topKeywords.slice(0, 4).map((item) => (
                <div key={item.topic} className="insight-focus-item">
                  <span className="insight-focus-label">{item.topic}</span>
                  <span className="insight-focus-count">{item.count}</span>
                </div>
              ))
            ) : (
              <div className="insight-empty">Upload a document to see focus areas.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="insight-card"
        >
          <div className="insight-card-head">
            <div className="insight-icon insight-icon-alt">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="insight-card-title">Topic share</h4>
              <p className="insight-card-subtitle">Donut + labels for quick scanning</p>
            </div>
          </div>
          <div className="insight-chart insight-chart-wide">
            {topKeywords.length > 0 ? (
              <div className="insight-donut">
                <div className="insight-donut-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topKeywords}
                        dataKey="count"
                        nameKey="topic"
                        innerRadius={52}
                        outerRadius={92}
                        paddingAngle={2}
                        labelLine={false}
                        label={renderLabel}
                      >
                        {topKeywords.map((entry, index) => (
                          <Cell key={entry.topic} fill={palette[index % palette.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="insight-donut-center">
                    <span className="insight-donut-value">{totalKeywordCount}</span>
                    <span className="insight-donut-label">Mentions</span>
                  </div>
                </div>
                <div className="insight-legend">
                  {topKeywords.map((entry, index) => (
                    <div key={entry.topic} className="insight-legend-row">
                      <span
                        className="insight-legend-swatch"
                        style={{ background: palette[index % palette.length] }}
                      />
                      <span className="insight-legend-name">{entry.topic}</span>
                      <span className="insight-legend-value">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="insight-empty">No topic data available yet.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="insight-card insight-wide"
        >
          <div className="insight-card-head">
            <div className="insight-icon">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="insight-card-title">Signal wave</h4>
              <p className="insight-card-subtitle">Smoother view of activity intensity</p>
            </div>
          </div>
          <div className="insight-chart insight-chart-lg">
            {mentionsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mentionsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mentions"
                    stroke="hsl(var(--chart-3))"
                    fill="hsl(var(--chart-3))"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="insight-empty">No activity data available yet.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="insight-card insight-wide"
        >
          <div className="insight-card-head">
            <div className="insight-icon insight-icon-warm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="insight-card-title">Topic landscape</h4>
              <p className="insight-card-subtitle">Treemap view for dense themes</p>
            </div>
          </div>
          <div className="insight-chart insight-chart-lg">
            {topKeywords.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={topKeywords.map((item, index) => ({
                    name: item.topic,
                    size: item.count,
                    fill: palette[index % palette.length],
                  }))}
                  dataKey="size"
                  stroke="hsl(var(--border))"
                  fill="hsl(var(--chart-2))"
                />
              </ResponsiveContainer>
            ) : (
              <div className="insight-empty">No topic data available yet.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
