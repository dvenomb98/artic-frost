import { ComponentProps } from "react";

function CodeUnstyled({ children, ...props }: ComponentProps<"code">) {
  return (
    <code {...props} className="text-xs !rounded-lg p-2">
      {children}
    </code>
  );
}

export { CodeUnstyled };
