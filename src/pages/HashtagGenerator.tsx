import { useState } from "react";
import { Hash, Copy, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const tones = ["Aesthetic", "Funny", "Professional", "Motivational", "Casual"];

export default function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic || !tone) {
      toast({ title: "Missing fields", description: "Please enter a topic and select a tone.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setHashtags([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate", {
        body: { topic, tone: tone.toLowerCase() },
      });

      if (error) throw error;
      if (data.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      const tags = Array.isArray(data.hashtags) ? data.hashtags : [];
      setHashtags(tags);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to generate.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Hashtags copied to clipboard." });
  };

  const hashtagsText = hashtags.join(" ");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hashtag Generator</h1>
        <p className="text-muted-foreground mt-1">Get AI-powered hashtags for maximum reach</p>
      </div>

      <Card className="shadow-lg border-0 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="h-5 w-5 text-primary" />
            Generate Hashtags
          </CardTitle>
          <CardDescription>Enter your content topic and preferred tone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ht-topic">Topic</Label>
            <Input
              id="ht-topic"
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
                <Hash className="mr-2 h-4 w-4" />
                Generate Hashtags
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {hashtags.length > 0 && (
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Hashtags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span key={i} className="inline-block rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(hashtagsText)}>
              <Copy className="mr-2 h-3.5 w-3.5" /> Copy Hashtags
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
