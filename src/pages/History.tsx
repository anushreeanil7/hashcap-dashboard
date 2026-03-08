import { Clock } from "lucide-react";

export default function History() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
      <h1 className="text-2xl font-bold">History</h1>
      <p className="text-muted-foreground mt-2">Your previously generated captions will appear here.</p>
    </div>
  );
}
