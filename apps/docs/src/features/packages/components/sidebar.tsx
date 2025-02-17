import * as React from "react";
import { PackageSwitcher } from "./package-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@artic-frost/ui/components";

import { getStaticFilesData } from "../lib/generators";
import { groupBy } from "../../../lib/utils/array";
import Link from "next/link";
import { sortGroups } from "../lib/utils";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activePackage: string;
}

export async function AppSidebar({ activePackage, ...props }: AppSidebarProps) {
  const filesData = await getStaticFilesData();

  const filteredFilesData = filesData.filter(
    file => file.packageName === activePackage
  );

  const packages = filesData
    .filter(
      (file, index, self) =>
        index === self.findIndex(f => f.packageName === file.packageName)
    )
    .map(file => ({
      packageName: file.packageName,
      // fix later
      defaultSlug: "introduction",
    }));

  const groups = groupBy(filteredFilesData, "metadata.category");
  const sortedGroups = sortGroups(groups);


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <PackageSwitcher data={packages} />
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(sortedGroups).map(([category, items]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel>{category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.metadata.title}>
                    <SidebarMenuButton asChild isActive={false}>
                      <Link href={`/${item.packageName}/${item.slug}`}>
                        {item.metadata.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
