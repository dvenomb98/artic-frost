import {FieldInput} from "@artic-frost/ui/composed";
import {rhf} from "./form";

import {type GenericFieldProps} from "./form";

import {InputProps} from "@artic-frost/ui/components";

type FormInputProps = GenericFieldProps & {
  inputProps?: InputProps;
};
function FormInput({name, label, description, inputProps}: FormInputProps) {
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
        />
      )}
    />
  );
}

export {FormInput};
