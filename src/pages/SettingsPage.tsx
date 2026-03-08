import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const lengths = [
  { value: "short", label: "Short", description: "Under 20 words" },
  { value: "medium", label: "Medium", description: "1-2 sentences" },
  { value: "long", label: "Long", description: "2-3 sentences" },
];

export default function SettingsPage() {
  const [captionLength, setCaptionLength] = useState("medium");

  useEffect(() => {
    const stored = localStorage.getItem("hashcap-caption-length");
    if (stored) setCaptionLength(stored);
  }, []);

  const handleChange = (value: string) => {
    setCaptionLength(value);
    localStorage.setItem("hashcap-caption-length", value);
    toast({ title: "Saved", description: "Caption length preference updated." });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your generation preferences</p>
      </div>

      <Card className="shadow-lg border-0 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary" />
            Caption Preferences
          </CardTitle>
          <CardDescription>Configure how your captions are generated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Caption Length</Label>
            <Select value={captionLength} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lengths.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label} — {l.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
