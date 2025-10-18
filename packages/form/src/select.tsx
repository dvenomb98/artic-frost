"use client";

import {FieldSelect, FieldSelectProps} from "@artic-frost/ui/composed";
import {GenericFieldProps, rhf} from "./form";

type FormSelectProps = GenericFieldProps & FieldSelectProps;

function FormSelect({name, selectProps, ...rest}: FormSelectProps) {
  const {control} = rhf.useFormContext();
  return (
    <rhf.Controller
      control={control}
      name={name}
      render={({field: {onChange, ...field}, fieldState}) => (
        <FieldSelect
          isInvalid={fieldState.invalid}
          error={fieldState.error?.message}
          selectProps={{
            onValueChange: onChange,
            ...field,
            ...selectProps,
          }}
          {...rest}
        />
      )}
    />
  );
}

export {FormSelect};
