"use client";

import {SidebarProvider} from "@artic-frost/ui/components";
import {UserClientProvider} from "@/features/auth/providers/user-client-provider";

function MainProviders({children}: {children: React.ReactNode}) {
  return (
    <UserClientProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </UserClientProvider>
  );
}

export {MainProviders};
