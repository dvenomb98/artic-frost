import { TOOLS } from "@core/lib/tools";
import { useCherryStore } from "@core/providers/store-provider";

import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Button,
  SidebarGroupLabel,
  SidebarGroup,
} from "@artic-frost/ui/components";

function SidebarTools() {
  const { tool_id, setToolId } = useCherryStore(state => state);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Painting</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="grid grid-cols-2">
          {Object.entries(TOOLS).map(([key, value]) => {
            const isSelected = tool_id === value.id;
            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton asChild>
                  <Button
                    variant={isSelected ? "secondary" : "ghost"}
                    className="w-full h-full"
                    onClick={() => setToolId(value.id)}
                  >
                    <value.icon className="w-5" />
                    <span className="sr-only">{key}</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarTools };
