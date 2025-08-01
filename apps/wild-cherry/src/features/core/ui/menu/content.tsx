// import * as React from "react";
// import {
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@artic-frost/ui/components";

// import {FILE_GROUP, FILE, FileActionKey} from "./file";
// import {useFileActions} from "./actions";
// import { UI_CONFIG } from "../const";
// import { cn } from "@artic-frost/ui/lib";

// function Content() {
//   const fileActions = useFileActions();

//   return (
//     <>
//       {Object.entries(FILE_GROUP).map(([groupKey, groupValue], index) => {
//         const groupItems = FILE[groupValue];

//         return (
//           <React.Fragment key={groupKey}>
//             {!!index && <DropdownMenuSeparator />}
//             <DropdownMenuGroup>
//               {Object.values(groupItems).map(item => (
//                 <DropdownMenuItem
//                   key={item.id}
//                   onClick={fileActions[item.id as FileActionKey]}>
//                   <item.icon className={cn(UI_CONFIG.ICON_SIZE, "mr-2")} />
//                   {item.label}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuGroup>
//           </React.Fragment>
//         );
//       })}
//     </>
//   );
// }

// export {Content};
