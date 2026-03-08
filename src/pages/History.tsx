import { useState, useEffect } from "react";
import { Clock, Copy, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface HistoryItem {
  topic: string;
  tone: string;
  caption: string;
  hashtags: string[];
  timestamp: number;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hashcap-history") || "[]");
    setHistory(stored);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("hashcap-history");
    setHistory([]);
    toast({ title: "Cleared", description: "History has been cleared." });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground mt-2">Your previously generated captions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground mt-1">{history.length} generation{history.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory}>
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Clear All
        </Button>
      </div>

      {history.map((item, i) => (
        <Card key={i} className="shadow-md border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base capitalize">{item.topic}</CardTitle>
              <span className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleDateString()} · {item.tone}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground">{item.caption}</p>
            <p className="text-sm text-primary font-medium">{item.hashtags.join(" ")}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.caption, "Caption")}>
                <Copy className="mr-2 h-3.5 w-3.5" /> Caption
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.hashtags.join(" "), "Hashtags")}>
                <Copy className="mr-2 h-3.5 w-3.5" /> Hashtags
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
