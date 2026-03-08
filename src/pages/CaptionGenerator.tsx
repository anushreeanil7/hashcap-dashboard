import { useState } from "react";
import axios from "axios";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const tones = ["Funny", "Motivational", "Casual", "Professional"];

export default function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic || !tone) {
      toast({ title: "Missing fields", description: "Please enter a topic and select a tone.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setCaption("");
    setHashtags([]);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone: tone.toLowerCase() }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setCaption(data.caption || "");
      const tags = Array.isArray(data.hashtags) ? data.hashtags : typeof data.hashtags === "string" ? [data.hashtags] : [];
      setHashtags(tags);
    } catch {
      toast({ title: "Error", description: "Failed to generate. Make sure the API server is running at localhost:5000.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const hashtagsText = hashtags.join(" ");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Caption Generator</h1>
        <p className="text-muted-foreground mt-1">Generate engaging captions and hashtags with AI</p>
      </div>

      <Card className="shadow-lg border-0 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Your Caption
          </CardTitle>
          <CardDescription>Enter a topic and choose a tone to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder='e.g. "sunset beach", "fitness gym", "travel vlog"'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-11 gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Caption
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(caption || hashtags.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {caption && (
            <Card className="shadow-md border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Caption</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-foreground">{caption}</p>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(caption, "Caption")}>
                  <Copy className="mr-2 h-3.5 w-3.5" /> Copy Caption
                </Button>
              </CardContent>
            </Card>
          )}

          {hashtags.length > 0 && (
            <Card className="shadow-md border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Hashtags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-primary font-medium">{hashtagsText}</p>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(hashtagsText, "Hashtags")}>
                  <Copy className="mr-2 h-3.5 w-3.5" /> Copy Hashtags
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
