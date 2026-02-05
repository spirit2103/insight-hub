import { ReactNode, createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  MessageSquareText,
  LogOut,
  Menu
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// Create context for tab control
const TabContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: "upload",
  setActiveTab: () => {},
});

export const useTabContext = () => useContext(TabContext);

const navItems = [
  { icon: LayoutDashboard, label: "Overview", tabId: "upload" },
  { icon: FileText, label: "Documents", tabId: "documents" },
  { icon: BarChart3, label: "Insights", tabId: "insights" },
  { icon: MessageSquareText, label: "Q&A", tabId: "qa" },
];

function NavItem({ 
  icon: Icon, 
  label, 
  tabId, 
  isActive,
  onClick
}: { 
  icon: typeof LayoutDashboard; 
  label: string; 
  tabId: string; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function Sidebar({ className, activeTab, onTabChange }: { 
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className={cn("flex flex-col h-full bg-sidebar", className)}>
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.tabId}
            icon={item.icon}
            label={item.label}
            tabId={item.tabId}
            isActive={activeTab === item.tabId}
            onClick={() => onTabChange(item.tabId)}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children, activeTab: controlledActiveTab, onTabChange }: DashboardLayoutProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("upload");
  
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = onTabChange ?? setInternalActiveTab;

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-border flex-shrink-0">
          <Sidebar className="w-full" activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center gap-4 px-4 h-16 border-b border-border bg-background">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
              </SheetContent>
            </Sheet>
            <Logo />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </TabContext.Provider>
  );
}
