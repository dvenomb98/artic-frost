"use client";

import { SidebarProvider } from "@ui/components";
import { UserClientProvider } from "@/features/auth/providers/user-client-provider";

function MainProviders({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <UserClientProvider>{children}</UserClientProvider>
    </SidebarProvider>
  );
}

export { MainProviders };
