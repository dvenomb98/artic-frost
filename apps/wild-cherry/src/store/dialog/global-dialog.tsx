import { Dialog, DialogContent } from "@artic-frost/ui/components";
import { useDialogStore } from "./dialog-provider";

function GlobalDialog() {
  const store = useDialogStore(state => state);

  return (
    <>
      {store.open.map(dialog => (
        <Dialog
          key={dialog.id}
          {...dialog}
          open={true}
          onOpenChange={() => {
            dialog.onClose?.();
            store.closeDialog(dialog.id);
          }}
        >
          <DialogContent className={dialog.className}>
            {dialog.content}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}

export { GlobalDialog };
