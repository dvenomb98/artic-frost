import {ArrowUp, Download, File as FileIcon, Save} from "lucide-react";
import type {LucideIcon} from "lucide-react";

const FILE_GROUP = {
  MANAGERS: "MANAGERS",
  LOADERS: "LOADERS",
} as const;

const FILE_ACTIONS = {
  NEW: "NEW",
  SAVE: "SAVE",
  LOAD_LATEST: "LOAD_LATEST",
  DOWNLOAD: "DOWNLOAD",
} as const;

type FileGroupKey = keyof typeof FILE_GROUP;
type FileGroupValue = (typeof FILE_GROUP)[FileGroupKey];
type FileActionKey = keyof typeof FILE_ACTIONS;
type FileActionValue = (typeof FILE_ACTIONS)[FileActionKey];

type FileItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const FILE: Record<FileGroupValue, Partial<Record<FileActionKey, FileItem>>> = {
  [FILE_GROUP.MANAGERS]: {
    [FILE_ACTIONS.NEW]: {
      id: FILE_ACTIONS.NEW,
      label: "New",
      icon: FileIcon,
    },
    [FILE_ACTIONS.SAVE]: {
      id: FILE_ACTIONS.SAVE,
      label: "Save",
      icon: Save,
    },
    [FILE_ACTIONS.LOAD_LATEST]: {
      id: FILE_ACTIONS.LOAD_LATEST,
      label: "Load latest",
      icon: ArrowUp,
    },
  },
  [FILE_GROUP.LOADERS]: {
    [FILE_ACTIONS.DOWNLOAD]: {
      id: FILE_ACTIONS.DOWNLOAD,
      label: "Download",
      icon: Download,
    },
  },
};

export {
  FILE,
  FILE_ACTIONS,
  FILE_GROUP,
  type FileActionKey,
  type FileActionValue,
};
