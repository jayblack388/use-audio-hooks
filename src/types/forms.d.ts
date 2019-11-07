import { ReactNode } from 'react';
import { DefaultTheme } from 'styled-components';
import { AdjustableDimensions } from './ui';

export interface ContextArgs {
  id: string;
  value: string | boolean | number | { [key: string]: any };
}

export interface defaultValuesInterface {
  defaultValues?: { [key: string]: any };
}

export type FieldContainerProps = {
  error: boolean;
  theme: DefaultTheme;
};

export interface FieldInterface {
  defaultValue: string;
  error?: string;
  fieldName: string;
  label?: boolean;
  options?: string[] | { [key: string]: any }[];
  placeholder: string;
  required?: boolean;
  type: string;
}

export interface FieldStateInterface {
  formState: { [key: string]: any };
  registerField(fieldData: ContextArgs): void;
  resetForm(): void;
  update(fieldData: ContextArgs): void;
}

export interface FileInterface {
  file: File;
  id: number;
}

export interface FormProps extends FormWrapperInterface {
  defaultValues: defaultValuesInterface;
}

export interface FormProviderProps {
  children: ReactNode;
  defaultValues: { [key: string]: any };
}

export type FormReducerAction =
  | {
      type: 'REGISTER_FIELD';
      id: string;
      value: string | boolean | number | { [key: string]: any };
    }
  | { type: 'RESET_FORM' }
  | {
      type: 'UPDATE_FORM';
      id: string;
      value: string | boolean | number | { [key: string]: any };
    };

export type FormReducerState = any;

export interface FormWrapperInterface extends AdjustableDimensions {
  autoComplete: 'on' | 'off';
  children: ReactNode | ReactNode[];
  disabled?: boolean;
  defaultValues: defaultValuesInterface;
  onBlur?(formState: { [key: string]: any }): void;
  onSubmit(formState: { [key: string]: any }): void;
  submitText?: string;
}

export type InputProps = {
  theme: DefaultTheme;
};

export type Option = string | { [key: string]: any };

export type RequiredProps = {
  theme: DefaultTheme;
};
