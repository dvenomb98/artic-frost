import * as React from "react";
import {Input, type InputProps} from "../components/input";
import {Label, type LabelProps} from "../components/label";

type ComposedInputProps = InputProps & {
  label: React.ReactNode;
  labelProps?: LabelProps;
  rightElement?: React.ReactNode;
};

function ComposedInput({
  label,
  labelProps,
  rightElement,
  ...props
}: ComposedInputProps) {
  const id = React.useId();

  return (
    <div className="grid w-full gap-3">
      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>
      <div className="flex items-center w-full gap-3">
        <Input id={id} {...props} />
        {rightElement}
      </div>
    </div>
  );
}

export {ComposedInput, type InputProps};
