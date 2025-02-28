import * as React from "react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@artic-frost/ui/components";

import { FILE_GROUP, FILE, FileActionKey } from "./file";
import { useFileActions } from "./use-file-actions";

function FileMenuContent() {
  const fileActions = useFileActions();

  return (
    <>
      {Object.entries(FILE_GROUP).map(([groupKey, groupValue], index) => {
        const groupItems = FILE[groupValue];

        return (
          <React.Fragment key={groupKey}>
            {!!index && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {Object.values(groupItems).map(item => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={fileActions[item.id as FileActionKey]}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </React.Fragment>
        );
      })}
    </>
  );
}

export { FileMenuContent };
