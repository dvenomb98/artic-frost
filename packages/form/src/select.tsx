import {FieldSelect, FieldSelectProps} from "@artic-frost/ui/composed";
import {GenericFieldProps, rhf} from "./form";

type FormSelectProps = GenericFieldProps &
  Omit<FieldSelectProps, "isInvalid" | "error">;

function FormSelect({
  name,
  label,
  description,
  options,
  placeholder,
  triggerProps,
  selectProps,
}: FormSelectProps) {
  const {control} = rhf.useFormContext();
  return (
    <rhf.Controller
      control={control}
      name={name}
      render={({field: {onChange, ...field}, fieldState}) => (
        <FieldSelect
          isInvalid={fieldState.invalid}
          error={fieldState.error?.message}
          label={label}
          description={description}
          options={options}
          placeholder={placeholder}
          triggerProps={triggerProps}
          selectProps={{
            onValueChange: onChange,
            ...field,
            ...selectProps,
          }}
        />
      )}
    />
  );
}

export {FormSelect};
