import React, { FC } from 'react';
import {
  defaultValuesInterface,
  FormProps,
  FormWrapperInterface,
} from '../../types';
import { FormProvider, useFormContext } from './Forms.state';
import * as S from './Forms.styled';

const FormWrapper: FC<FormWrapperInterface> = ({
  autoComplete = 'off',
  children,
  height,
  onBlur = () => {},
  onSubmit = () => {},
  width,
}) => {
  const context = useFormContext();
  const { formState } = context;
  const prepEvent = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const data: defaultValuesInterface = {
      ...formState,
    };
    delete data.defaultValues;
    return data;
  };
  const submit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    const data = prepEvent(e);
    onSubmit(data);
  };
  const blur = (e: React.FormEvent<HTMLFormElement>) => {
    if (!onBlur) return;
    const data = prepEvent(e);
    onBlur(data);
  };
  return (
    <S.Form
      height={height}
      width={width}
      onBlur={blur}
      autoComplete={autoComplete}
      onSubmit={submit}
    >
      {children}
    </S.Form>
  );
};

export const Form: FC<FormProps> = ({ defaultValues = {}, ...rest }) => (
  <FormProvider defaultValues={defaultValues}>
    <FormWrapper {...(rest as FormWrapperInterface)} />
  </FormProvider>
);
