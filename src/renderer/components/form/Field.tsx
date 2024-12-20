import { get } from 'lodash';
import React from 'react';
import { FormikValues, useFormikContext } from 'formik';
import { Checkbox, Datepicker, Label, Textarea, TextInput } from 'flowbite-react';
import { TagInput } from './TagInput';
import { Select, SelectOption } from '@/components';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';

interface FieldProps {
  name: string;
  label?: string;
  type: 'text' | 'textarea' | 'picklist' | 'checkbox' | 'radio' | 'tag' | 'date' | 'link' | 'number';
  options?: SelectOption[];
  freeform?: boolean;
  readonly?: boolean;
  required?: boolean;
  initialValue?: any;
  disabled?: boolean;
}

const renderOption = (options, initialValue) => {
  // Find the option that matches the initialValue
  const foundOption = options?.find((option) => {
    if (typeof option === 'object') {
      return option.value === initialValue;
    } else {
      return option === initialValue;
    }
  });

  // Determine the label to display
  if (foundOption) {
    if (typeof foundOption === 'object') {
      return foundOption.label; // Use label from the object
    } else {
      return foundOption; // Use the value directly as it is a string or number
    }
  } else {
    return 'No Option Selected';
  }
};

const Field: React.FC<FieldProps> = ({
  name,
  label,
  type,
  options,
  readonly,
  required,
  initialValue,
  disabled = false,
  freeform = false,
}) => {
  // @ts-ignore
  const { errors, setFieldValue, values }: FormikValues = useFormikContext();

  const isError: boolean = !!get(errors, name);

  if (readonly) {
    const renderReadOnlyField = () => {
      if (!initialValue) {
        return (
          <p className="capitalize">
            <FormattedMessage id="not-specified" />
          </p>
        );
      }

      switch (type) {
        case 'picklist':
          return <p className="dark:text-white">{renderOption(options, initialValue)}</p>;
        case 'link':
          return (
            <a
              href={initialValue}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 break-words hover:underline overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400"
            >
              {initialValue}
            </a>
          );
        case 'date':
          return `${dayjs(new Date(initialValue)).format('MMMM D, YYYY')}`;
        case 'tag':
          return (
            <TagInput defaultValue={initialValue} onChange={(tags) => setFieldValue(name, tags)} readonly={readonly} />
          );
        default:
          return (
            <p className="dark:text-white overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">{initialValue}</p>
          );
      }
    };
    return (
      <div className="mb-4">
        {label && <Label htmlFor={name}>{label}</Label>}
        <div id={name} className="p-2 rounded-lg bg-gray-100 max-w-fit">
          {renderReadOnlyField()}
        </div>
        {isError && <p className="text-red-500 text-xs italic">{get(errors, name)}</p>}
      </div>
    );
  }

  const renderField = () => {
    switch (type) {
      case 'text':
      case 'link':
      case 'number':
        return (
          <TextInput
            id={name}
            name={name}
            type={type === 'number' ? 'number' : 'text'}
            defaultValue={initialValue}
            onChange={(e) => setFieldValue(name, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={name}
            name={name}
            defaultValue={initialValue}
            onChange={(e) => setFieldValue(name, e.target.value)}
          />
        );
      case 'picklist':
        return (
          <Select
            id={name}
            name={name}
            disabled={disabled}
            freeform={freeform}
            initialValue={initialValue}
            onChange={(value) => setFieldValue(name, value)}
            options={options}
          />
        );
      case 'date': {
        const props: any = {
          showTodayButton: true,
          showClearButton: false,
          onChange: (date) => {
            const dateValue = date ? date.toISOString() : undefined;
            console.log(`setting ${name} to ${dateValue}`);
            setFieldValue(name, dateValue);
          },
          placeholder: 'Select date',
        };

        const formValue = get(values, name);
        const formValueIsDate = !isNaN(Date.parse(formValue));

        if (!initialValue && !formValue) {
          props.value = undefined;
        } else if (formValue && formValueIsDate) {
          props.value = new Date(formValue);
        }

        return (
          <div key={initialValue}>
            <Datepicker {...props} />
          </div>
        );
      }
      case 'checkbox':
        return <Checkbox id={name} name={name} onChange={(e) => setFieldValue(name, e.target.checked)} />;
      // Add cases for other field types as needed
      case 'tag':
        return <TagInput defaultValue={initialValue} onChange={(tags) => setFieldValue(name, tags)} />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <div className="flex">
          {!readonly && required && <p className="text-red-600 mr-1">*</p>}
          <Label htmlFor={name}>{label}</Label>
        </div>
      )}
      {renderField()}
      {get(errors, name) && <p className="text-red-500 text-s italic">{get(errors, name)}</p>}
    </div>
  );
};

export { Field };
