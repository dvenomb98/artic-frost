import { Footer } from "@/features/cv/components/footer";
import { Navbar } from "@/features/cv/components/navbar/navbar";
import { CONTAINER_CLASSES } from "@/lib/classes";
import { cn } from "@artic-frost/ui/lib";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div
      className={cn(
        CONTAINER_CLASSES,
        "flex flex-col min-h-screen py-5 md:py-20 gap-20"
      )}
    >
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
