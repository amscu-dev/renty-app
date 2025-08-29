import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Edit, X, Plus } from "lucide-react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "../ui/multi-select";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
);

interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "password"
    | "file"
    | "multi-input"
    | "radio-group"
    | "multi-select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  optionsRadio?: { value: string; label: string; explanation: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  showErrorMessage?: boolean;
  initialValue?: string | number | boolean | string[];
}

export const CustomFormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  options,
  optionsRadio,
  accept,
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  multiple = false,
  showErrorMessage = true,
  isIcon = false,
  initialValue,
}) => {
  const { control } = useFormContext();

  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            rows={3}
            className={`border-gray-200 p-4 ${inputClassName}`}
          />
        );
      case "multi-select":
        return (
          <MultiSelect
            onValuesChange={field.onChange}
            values={field.value || (initialValue as string[])}
            defaultValues={field.value || (initialValue as string[])}
          >
            <MultiSelectTrigger className="w-full">
              <MultiSelectValue
                placeholder={placeholder}
                overflowBehavior="wrap-when-open"
              />
            </MultiSelectTrigger>
            <MultiSelectContent>
              <MultiSelectGroup>
                {options?.map((option) => (
                  <MultiSelectItem
                    key={option.value}
                    value={option.value}
                    className={`cursor-pointer hover:!bg-gray-100`}
                  >
                    {option.label}
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>
        );
      case "select":
        return (
          <Select
            value={field.value || (initialValue as string)}
            defaultValue={field.value || (initialValue as string)}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={`w-full border-gray-200 p-4 ${inputClassName}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="w-full border-gray-200 shadow-xl">
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={`cursor-pointer hover:!bg-gray-100`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
              className={`text-customgreys-dirtyGrey ${inputClassName} cursor-pointer`}
            />
            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        );
      case "file":
        return (
          <FilePond
            allowImagePreview
            className={`${inputClassName}`}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file);
              field.onChange(files);
            }}
            maxFiles={10}
            allowMultiple={true}
            labelIdle={`Drag & Drop your images or <span class="filepond--label-action">Browse</span>`}
            credits={false}
            allowFileTypeValidation
            acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
            allowFileSizeValidation
            maxFileSize="1MB"
            maxTotalFileSize="10MB"
            disabled={disabled}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
      case "multi-input":
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
          />
        );
      case "radio-group":
        return (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col"
          >
            {optionsRadio?.map((option) => (
              <FormItem className="flex items-center gap-3" key={option.value}>
                <FormControl>
                  <RadioGroupItem value={option.value} />
                </FormControl>
                <FormLabel className="cursor-pointer font-sans font-normal">
                  <div className="group">
                    <span className="mr-2 font-semibold text-slate-800 transition-colors duration-150 group-hover:text-orange-600">
                      {option.label}
                    </span>
                    <span className="text-slate-400 transition-colors duration-150 group-hover:text-orange-600">
                      {option.explanation}
                    </span>
                  </div>
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem
          className={`${
            type !== "switch" && "rounded-md"
          } relative ${className}`}
        >
          {type !== "switch" && (
            <div className="flex items-center justify-between">
              <FormLabel className={`text-sm ${labelClassName}`}>
                {label}
              </FormLabel>

              {!disabled &&
                isIcon &&
                type !== "file" &&
                type !== "multi-input" && (
                  <Edit className="text-customgreys-dirtyGrey size-4" />
                )}
            </div>
          )}
          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>
          {showErrorMessage ? <FormMessage /> : null}
        </FormItem>
      )}
    />
  );
};
interface MultiInputFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  placeholder?: string;
  inputClassName?: string;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className={`bg-customgreys-darkGrey flex-1 border-none p-4 ${inputClassName}`}
                />
              </FormControl>
            )}
          />
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            className="text-customgreys-dirtyGrey"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append("")}
        variant="outline"
        size="sm"
        className="text-customgreys-dirtyGrey mt-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
};
