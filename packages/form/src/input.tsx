import {useFormContext} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  GenericFieldProps,
} from "./form";

import {Input, InputProps} from "@artic-frost/ui/components";

type FormInputProps = GenericFieldProps & {
  inputProps?: InputProps;
};
function FormInput({name, label, description, inputProps}: FormInputProps) {
  const {control} = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export {FormInput};
