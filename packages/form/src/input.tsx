"use client";

import {FieldInput, FieldInputProps} from "@artic-frost/ui/composed";
import {rhf} from "./form";

import {type GenericFieldProps} from "./form";

type FormInputProps = GenericFieldProps & FieldInputProps;

function FormInput({
  name,
  label,
  description,
  inputProps,
  ...rest
}: FormInputProps) {
  const {control} = rhf.useFormContext();
  return (
    <rhf.Controller
      control={control}
      name={name}
      render={({field, fieldState}) => (
        <FieldInput
          isInvalid={fieldState.invalid}
          error={fieldState.error?.message}
          label={label}
          description={description}
          inputProps={{...field, ...inputProps}}
          {...rest}
        />
      )}
    />
  );
}

export {FormInput};
