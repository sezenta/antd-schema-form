import SchemaForm, {
  FormColumn,
  FormField,
  FormFieldsProps,
  TypeAdapter,
  ValidationAdapter,
  FormSchema,
} from './form/Form';
import React from 'react';
import { FormProps } from 'antd/lib/form';
import { SchemaFormConfigProvider, SchemaFormConfigProviderProps } from './form/SchemaFormConfig';
import { MapProps as InternalMapProps } from './form/CommonAdapters';
import { HiddenInput, LabelInput } from './form/CommonInputs';

const Form: React.FC<FormProps<any>> = SchemaForm.Form;
const Item: typeof import('antd/lib/form/FormItem').default = SchemaForm.Item;
const Items: React.FC<FormFieldsProps> = SchemaForm.Items;
const List: React.FC<import('antd/lib/form').FormListProps> = SchemaForm.List;
const ErrorList: typeof import('antd/lib/form/ErrorList').default = SchemaForm.ErrorList;
const useForm: typeof import('antd/lib/form/Form').useForm = SchemaForm.useForm;
const Provider: React.FC<import('antd/lib/form/context').FormProviderProps> = SchemaForm.Provider;
const SchemaFormConfig: React.FC<SchemaFormConfigProviderProps> = SchemaFormConfigProvider;
const MapProps: typeof InternalMapProps = InternalMapProps;

export {
  Form,
  Item,
  Items,
  List,
  ErrorList,
  useForm,
  Provider,
  SchemaFormConfig,
  MapProps,
  HiddenInput,
  LabelInput,
  FormColumn,
  FormField,
  FormFieldsProps,
  TypeAdapter,
  ValidationAdapter,
  FormSchema,
};

export default SchemaForm;
