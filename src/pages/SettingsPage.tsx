import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <Settings className="h-12 w-12 mx-auto text-primary mb-4" />
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground mt-2">Account and preference settings coming soon.</p>
    </div>
  );
}
