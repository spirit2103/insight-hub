import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Calendar, FileText, Hash, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MetadataField {
  key: string;
  label: string;
  value: string;
  icon: typeof Building2;
  editable?: boolean;
}

interface MetadataCardProps {
  documentName: string;
  metadata: MetadataField[];
  onSave?: (key: string, value: string) => void;
}

export function MetadataCard({ documentName, metadata, onSave }: MetadataCardProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const handleSave = (key: string) => {
    onSave?.(key, editValue);
    setEditingKey(null);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border border-border bg-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{documentName}</h3>
            <p className="text-sm text-muted-foreground">Document Metadata</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metadata.map((field) => (
          <div
            key={field.key}
            className={cn(
              "p-3 rounded-lg bg-secondary/30",
              field.editable && "hover:bg-secondary/50 transition-colors"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <field.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {field.label}
              </span>
            </div>
            
            {editingKey === field.key ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-success"
                  onClick={() => handleSave(field.key)}
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <p className="font-medium text-foreground">{field.value || "—"}</p>
                {field.editable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(field.key, field.value)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Preset metadata for demo
export const sampleMetadata: MetadataField[] = [
  { key: "company", label: "Company", value: "Acme Corporation", icon: Building2, editable: true },
  { key: "year", label: "Document Year", value: "2024", icon: Calendar, editable: true },
  { key: "established", label: "Established", value: "1985", icon: Calendar },
  { key: "type", label: "Document Type", value: "Annual Report", icon: FileText, editable: true },
  { key: "pages", label: "Pages", value: "142", icon: Hash },
];
