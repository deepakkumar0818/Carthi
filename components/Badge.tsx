import { getStatusColor } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "status";
  className?: string;
}

export const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const baseStyles = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm";
  const statusColor = variant === "status" ? getStatusColor(children as string) : "bg-gray-100 text-gray-800";
  
  return (
    <span className={`${baseStyles} ${statusColor} ${className}`}>
      {children}
    </span>
  );
};
