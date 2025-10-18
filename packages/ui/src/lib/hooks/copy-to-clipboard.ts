import * as React from "react";

function useCopyToClipboard() {
  const [isCopied, setIsCopied] = React.useState(false);

  async function copyToClipboard(value: string | number) {
    await navigator.clipboard.writeText(value.toString());
    setIsCopied(true);
  }

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return {isCopied, copyToClipboard};
}

export {useCopyToClipboard};
