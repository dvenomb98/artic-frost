import {cn} from "@artic-frost/ui/lib";

function PageContainer({
  children,
  title,

  description,
  className,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div>
        <h1 className="h1 mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {children}
    </div>
  );
}

export {PageContainer};
