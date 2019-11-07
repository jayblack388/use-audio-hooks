import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {
  FieldStateInterface,
  FormProviderProps,
  FormReducerAction,
  FormReducerState,
} from '../../types';
const REGISTER_FIELD = 'REGISTER_FIELD';
const RESET_FORM = 'RESET_FORM';
const UPDATE_FORM = 'UPDATE_FORM';

const initialState = {
  formState: {},
  registerField: () => {},
  resetForm: () => {},
  update: () => {},
};

export const FormContext = createContext<FieldStateInterface>(initialState);
export const useFormContext = () => useContext(FormContext);

function formReducer(state: FormReducerState, action: FormReducerAction) {
  switch (action.type) {
    case REGISTER_FIELD:
      const temp = {
        ...state,
      };
      if (!temp[action.id]) {
        temp[action.id] = action.value || '';
      }
      if (!temp.defaultValues[action.id]) {
        temp.defaultValues[action.id] = action.value || '';
      }
      return temp;
    case RESET_FORM:
      const { defaultValues } = state;
      return {
        defaultValues,
        ...state.defaultValues,
      };
    case UPDATE_FORM:
      const data: { [key: string]: any } = {};
      data[action.id] = action.value;
      return { ...state, ...data };
    default:
      throw new Error();
  }
}

export function FormProvider({ children, defaultValues }: FormProviderProps) {
  const [formState, dispatch] = useReducer(formReducer, {
    defaultValues,
    ...defaultValues,
  });
  const ContextProvider: FieldStateInterface = {
    formState,
    registerField: ({ id, value }) =>
      dispatch({ type: REGISTER_FIELD, id, value }),
    resetForm: () => dispatch({ type: RESET_FORM }),
    update: ({ id, value }) => dispatch({ type: UPDATE_FORM, id, value }),
  };
  return (
    <FormContext.Provider value={ContextProvider}>
      {children}
    </FormContext.Provider>
  );
}
