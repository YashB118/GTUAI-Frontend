import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  hover?: boolean;
}

export function Card({ children, className, accent, hover }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-card border border-border rounded-lg p-5 transition-all duration-200",
        hover && "hover:border-accent/40 hover:bg-card-gradient hover:-translate-y-0.5 cursor-pointer",
        accent && "border-accent/30 shadow-accent bg-card-gradient",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-base font-medium text-text-primary", className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>;
}
