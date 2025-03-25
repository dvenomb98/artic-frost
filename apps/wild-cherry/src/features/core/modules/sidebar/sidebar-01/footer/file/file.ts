import {
  ArrowUp,
  Download,
  File as FileIcon,
  Link2,
  Save,
  Upload,
} from "lucide-react";
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
  UPLOAD: "UPLOAD",
  UPLOAD_FROM_URL: "UPLOAD_FROM_URL",
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
    [FILE_ACTIONS.UPLOAD]: {
      id: FILE_ACTIONS.UPLOAD,
      label: "Upload",
      icon: Upload,
    },
    [FILE_ACTIONS.UPLOAD_FROM_URL]: {
      id: FILE_ACTIONS.UPLOAD_FROM_URL,
      label: "Upload from URL",
      icon: Link2,
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
