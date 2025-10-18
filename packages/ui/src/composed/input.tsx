"use client";

import {useCopyToClipboard} from "../lib";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputProps,
  Label,
} from "../components";

import {CheckIcon, CopyIcon} from "lucide-react";

import * as React from "react";

type CopyInputProps = {
  inputProps: InputProps & {value: string | number};
  label?: React.ReactNode;
  description?: React.ReactNode;
};

function CopyInput({inputProps, label, description}: CopyInputProps) {
  const {copyToClipboard, isCopied} = useCopyToClipboard();
  const reactId = React.useId();
  const id = inputProps.id || reactId;

  return (
    <div className="grid gap-2">
      {!!label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <InputGroupInput readOnly id={id} {...inputProps} />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => {
              copyToClipboard(inputProps.value);
            }}>
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {!!description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
    </div>
  );
}

export {CopyInput, type CopyInputProps};
