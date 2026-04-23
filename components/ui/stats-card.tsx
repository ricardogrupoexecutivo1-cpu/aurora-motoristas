"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  description,
}: StatsCardProps) {
  const changeColors = {
    positive: "text-success bg-success/10",
    negative: "text-red-400 bg-red-400/10",
    neutral: "text-muted-foreground bg-white/5",
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/5 ${iconColor} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold gradient-text">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
