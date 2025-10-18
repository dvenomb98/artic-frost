"use client";

import {
  FieldDropdownCheckboxes,
  FieldDropdownCheckboxesProps,
} from "@artic-frost/ui/composed";
import {GenericFieldProps, rhf} from "./form";

type FormDropdownCheckboxesProps = GenericFieldProps &
  Omit<FieldDropdownCheckboxesProps, "selectedValues" | "onChange">;

function FormDropdownCheckboxes({name, ...rest}: FormDropdownCheckboxesProps) {
  const {control} = rhf.useFormContext();

  return (
    <rhf.Controller
      name={name}
      control={control}
      render={({field: {value, ...field}, fieldState}) => (
        <FieldDropdownCheckboxes
          isInvalid={fieldState.invalid}
          error={fieldState.error?.message}
          selectedValues={value || []}
          {...field}
          {...rest}
        />
      )}
    />
  );
}

export {FormDropdownCheckboxes};
