import { cn } from "@artic-frost/ui/lib";

/**
 * 
 * This component is used to wrap the content inside Sidebar Inset.
 * 
 * Should be used if there is specific need for container/padding/etc.
 * 
 */
function ContentInset({children, className}: {children: React.ReactNode, className?: string}) {
  return (
    <div className={cn("container py-10", className)}>{children}</div>
  );
}

export {ContentInset};