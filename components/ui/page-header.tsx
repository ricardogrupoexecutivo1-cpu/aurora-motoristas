"use client";

import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "primary" | "success" | "warning" | "danger";
  };
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions,
  badge,
}: PageHeaderProps) {
  const badgeColors = {
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    danger: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 rounded-2xl gradient-premium shadow-lg neon-primary">
              <Icon className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
              {badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColors[badge.variant || "primary"]}`}>
                  {badge.text}
                </span>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
