import * as React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
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
import {ChevronDown} from "lucide-react";
import {cn} from "../lib";

type CommonProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  isInvalid?: boolean;
  error?: string;
};

type FieldInputProps = CommonProps & {
  inputProps?: InputProps;
};

function FieldInput({
  label,
  description,
  inputProps,
  isInvalid,
  error,
}: FieldInputProps) {
  const reactId = React.useId();
  const {id, ...rest} = inputProps || {};
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
  placeholder?: React.ReactNode;
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

type FieldDropdownCheckboxesProps<T = string> = CommonProps & {
  options: {
    value: T;
    label: React.ReactNode;
  }[];
  selectedValues: T[];
  placeholder?: React.ReactNode;
  menuProps?: React.ComponentProps<typeof DropdownMenu>;
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>;
  buttonProps?: React.ComponentProps<typeof Button>;
  onChange: (selectedValues: T[]) => void;
  closeOnChange?: boolean;
};

function FieldDropdownCheckboxes<T = string>({
  label,
  description,
  options,
  isInvalid,
  error,
  placeholder = "Select an option",
  buttonProps,
  menuProps,
  selectedValues,
  onChange,
  closeOnChange = false,
  contentProps,
}: FieldDropdownCheckboxesProps<T>) {
  const reactId = React.useId();

  const {className, ...restContentProps} = contentProps || {};
  const {className: buttonClassName, ...restButtonProps} = buttonProps || {};

  const handleCheckedChange = (value: T, checked: boolean) => {
    checked
      ? onChange([...selectedValues, value])
      : onChange(selectedValues.filter((v: T) => v !== value));
  };
  return (
    <Field data-invalid={isInvalid}>
      {!!label && <FieldLabel htmlFor={reactId}>{label}</FieldLabel>}
      <DropdownMenu {...menuProps}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-between text-left", buttonClassName)}
            {...restButtonProps}>
            {placeholder}
            <ChevronDown className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("max-h-[450px] overflow-y-auto", className)}
          {...restContentProps}>
          {options.map(option => (
            <DropdownMenuCheckboxItem
              onSelect={e => {
                if (!closeOnChange) {
                  e.preventDefault();
                }
              }}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={checked =>
                handleCheckedChange(option.value, checked)
              }
              key={String(option.value)}
              {...option}>
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {!!description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && error && <FieldError errors={[{message: error}]} />}
    </Field>
  );
}

export {
  FieldInput,
  FieldSelect,
  FieldDropdownCheckboxes,
  type FieldInputProps,
  type FieldSelectProps,
  type CommonProps,
  type FieldDropdownCheckboxesProps,
};
