import React, { useEffect, useRef, FC } from 'react';
import { snakeToTitle } from '../../../utils/helpers';
import { FieldInterface } from '../../../types';
import { useFormContext } from '../Forms.state';
import * as S from '../Forms.styled';

const Field: FC<FieldInterface> = ({
  required,
  fieldName,
  type,
  label,
  error,
  placeholder,
  options,
  defaultValue,
  ...rest
}) => {
  const { formState, update, registerField } = useFormContext();
  const ref = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  };
  useEffect(() => {
    registerField({ id: fieldName, value: defaultValue });
  }, []);
  return (
    <S.FieldContainer error={!!error}>
      <S.LabelContainer onClick={focusInput} htmlFor={fieldName}>
        <S.Label>
          {label && snakeToTitle(fieldName)} {required && <S.Required />}
        </S.Label>
        <S.Input
          id={`field-${fieldName}`}
          onChange={e => {
            update({ id: fieldName, value: e.target.value });
          }}
          placeholder={placeholder}
          ref={ref}
          required={required}
          type={type}
          value={formState[fieldName]}
          {...rest}
        />
      </S.LabelContainer>
      {error && <div>{error}</div>}
    </S.FieldContainer>
  );
};

Field.defaultProps = {
  fieldName: '',
  defaultValue: undefined,
  options: [],
  required: false,
  label: true,
  placeholder: '',
  type: 'text',
};

export { Field };
