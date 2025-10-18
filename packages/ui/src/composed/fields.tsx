import * as React from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  InputProps,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components";

type CommonProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  isInvalid?: boolean;
  error?: string;
};

type FieldInputProps = CommonProps & {
  inputProps: InputProps;
};

function FieldInput({
  label,
  description,
  inputProps,
  isInvalid,
  error,
}: FieldInputProps) {
  const reactId = React.useId();
  const {id, ...rest} = inputProps;
  const inputId = id || reactId;

  return (
    <Field data-invalid={isInvalid}>
      {!!label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <Input id={inputId} aria-invalid={isInvalid} {...rest} />
      {!!description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && error && <FieldError errors={[{message: error}]} />}
    </Field>
  );
}

type FieldSelectProps = CommonProps & {
  options: {
    value: string;
    label: React.ReactNode;
  }[];
  triggerProps?: React.ComponentProps<typeof SelectTrigger>;
  selectProps?: React.ComponentProps<typeof Select>;
  placeholder?: string;
};

function FieldSelect({
  label,
  description,
  options,
  isInvalid,
  error,
  triggerProps,
  selectProps,
  placeholder = "Select an option",
}: FieldSelectProps) {
  const reactId = React.useId();
  const {id, ...restTriggerProps} = triggerProps || {};

  const triggerId = id || reactId;

  return (
    <Field data-invalid={isInvalid}>
      {!!label && <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>}
      <Select {...selectProps}>
        <SelectTrigger
          id={triggerId}
          aria-invalid={isInvalid}
          {...restTriggerProps}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!!description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && error && <FieldError errors={[{message: error}]} />}
    </Field>
  );
}

export {
  FieldInput,
  FieldSelect,
  type FieldInputProps,
  type FieldSelectProps,
  type CommonProps,
};
