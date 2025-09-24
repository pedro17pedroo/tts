import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "primary" | "accent" | "destructive" | "secondary";
  "data-testid"?: string;
}

export default function StatsCard({ title, value, icon, color, "data-testid": testId }: StatsCardProps) {
  const colorClasses = {
    primary: "text-primary",
    accent: "text-accent",
    destructive: "text-destructive",
    secondary: "text-secondary",
  };

  return (
    <Card data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
          </div>
          <div className={colorClasses[color]}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
