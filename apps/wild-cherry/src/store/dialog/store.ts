import {createStore} from "zustand";

type DialogProps = {
  id: string;
  content: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

type DialogStore = {
  open: DialogProps[];
  openDialog: (props: Omit<DialogProps, "id">) => void;
  closeAllDialogs: () => void;
  closeDialog: (dialogId: string) => void;
};

function createDialogStore() {
  return createStore<DialogStore>()(set => ({
    open: [],
    openDialog: props => {
      const id = Math.random().toString(36).substring(2, 15);
      set(state => ({
        open: [...state.open, {id, ...props}],
      }));
    },
    closeAllDialogs: () => set({open: []}),
    closeDialog: (dialogId: string) =>
      set(state => ({
        open: state.open.filter(dialog => dialog.id !== dialogId),
      })),
  }));
}

export {createDialogStore, type DialogStore, type DialogProps};
