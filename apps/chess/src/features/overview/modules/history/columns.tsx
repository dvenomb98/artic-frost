import {createColumnHelper} from "@tanstack/react-table";
import {z} from "zod";

import {
  RAW_GAME_SCHEMA,
  SESSION_TYPE_SCHEMA,
  STATUS_SCHEMA,
} from "@/services/supabase/models";

import {
  CheckCircle2Icon,
  XIcon,
  HourglassIcon,
  LockIcon,
  LockOpenIcon,
  MoreHorizontal,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Button,
} from "@artic-frost/ui/components";

import Link from "next/link";
import {DataTableColumnHeader} from "@/components/tables/data-table-header";
import {ROUTES} from "@/lib/routes";

type TableSchema = z.infer<typeof RAW_GAME_SCHEMA> & {
  current_user_id: string;
};

const COLUMN_HELPER = createColumnHelper<TableSchema>();

const COLUMNS = [
  COLUMN_HELPER.accessor("created_at", {
    id: "Date",
    header: ({column}) => (
      <DataTableColumnHeader column={column}>Date</DataTableColumnHeader>
    ),
    cell: row => {
      return (
        <span className="text-muted-foreground">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
          }).format(new Date(row.getValue()))}
        </span>
      );
    },
  }),
  COLUMN_HELPER.accessor("status", {
    header: ({column}) => (
      <DataTableColumnHeader column={column}>Status</DataTableColumnHeader>
    ),
    cell: row => STATUS_MAP[row.getValue()],
  }),
  COLUMN_HELPER.accessor("game_state", {
    header: ({column}) => (
      <DataTableColumnHeader column={column}>Result</DataTableColumnHeader>
    ),
    cell: row => {
      const gameState = row.getValue();
      let status = "";
      switch (gameState) {
        case "DRAW":
          status = "Draw";
          break;
        case "CHECKMATE":
          status =
            row.row.original.current_user_id === row.row.original.winner_id
              ? "Win"
              : "Lose";

          break;
        case "SURRENDER":
          status = "Lose";
          break;
        default:
          status = row.row.original.status === "CANCELLED" ? "-" : "In-game";

          break;
      }

      return <span>{status}</span>;
    },
  }),
  COLUMN_HELPER.accessor("session_type", {
    header: ({column}) => (
      <DataTableColumnHeader column={column}>
        Session Type
      </DataTableColumnHeader>
    ),
    cell: row => SESSION_MAP[row.getValue()],
  }),
  COLUMN_HELPER.accessor("type", {
    header: ({column}) => (
      <DataTableColumnHeader column={column}>Game Type</DataTableColumnHeader>
    ),
  }),
  COLUMN_HELPER.accessor("id", {
    header: "Actions",
    cell: row => {
      const {id, status} = row.row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild disabled={status === "CANCELLED"}>
              <Link href={`${ROUTES.MAIN.PLAY}/${id}`}>Visit Game</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild disabled={status === "CANCELLED"}>
              <Link href={`${ROUTES.MAIN.REVIEW}/${id}`}>Analyze Game</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const STATUS_MAP: Record<z.infer<typeof STATUS_SCHEMA>, React.ReactNode> = {
  IN_QUEUE: (
    <span className="flex items-center gap-2">
      {" "}
      In Queue <HourglassIcon className="size-4 text-orange-400" />
    </span>
  ),
  IN_PROGRESS: (
    <span className="flex items-center gap-2">
      {" "}
      In Progress <HourglassIcon className="size-4 text-orange-400" />
    </span>
  ),
  FINISHED: (
    <span className="flex items-center gap-2">
      {" "}
      Finished <CheckCircle2Icon className="size-4 text-green-400" />
    </span>
  ),
  CANCELLED: (
    <span className="flex items-center gap-2">
      {" "}
      Cancelled <XIcon className="size-4 text-destructive" />
    </span>
  ),
};

const SESSION_MAP: Record<
  z.infer<typeof SESSION_TYPE_SCHEMA>,
  React.ReactNode
> = {
  PRIVATE: (
    <span className="flex items-center gap-2">
      <LockIcon className="size-4" /> Private
    </span>
  ),
  PUBLIC: (
    <span className="flex items-center gap-2">
      <LockOpenIcon className="size-4" /> Public
    </span>
  ),
};

export {COLUMNS, type TableSchema};
