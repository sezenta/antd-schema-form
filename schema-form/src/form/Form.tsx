import React, { FC, useCallback, useContext, useMemo, useState } from 'react';
import { Button, Col, Form as AntdForm, Row } from 'antd';
import { ColProps } from 'antd/lib/col';
import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import '../css/style.css';
import { FormInstance, FormProps } from 'antd/lib/form';
import { SchemaFormConfigContext } from './SchemaFormConfig';
export interface FormColumn {
  layout: ColProps;
  fields: FormField[];
}

export interface FormField {
  id: string;
  name?: NamePath;
  tips?: string;
  type:
    | 'string'
    | 'number'
    | 'label'
    | 'password'
    | 'email'
    | 'text'
    | 'date'
    | 'radio'
    | 'checkBox'
    | 'boolean'
    | 'select'
    | 'dateRange'
    | 'file'
    | 'image'
    | 'phone'
    | 'switch'
    | string
    | { array: FormField; addText?: string }
    | { object: FormSchema };
  props?: any;
  options?: any;
  visible?: ((value: any, form: FormInstance, parentPath: NamePathArr) => boolean) | boolean;
  layout?: ColProps;
  view?: (value: any) => React.ReactNode;
}

type NamePathArr = (string | number)[];
type NamePath = string | number | NamePathArr;

type FormXContextData = {
  value?: any;
  form: FormInstance;
};

const FormXContext = React.createContext<FormXContextData>({ form: undefined as any });

export interface FormFieldsProps {
  schema: FormSchema;
  layout?: 'horizontal' | 'vertical';
  adapters?: TypeAdapter[];
  validationAdapters?: ValidationAdapter[];
  className?: string;
  fieldData?: any;
  parentPath?: NamePathArr;
}

export type TypeAdapter = React.ElementType;

export interface ValidationAdapter {
  name: string;
  validator: any;
  message: string;
}

export type FormSchema = FormField | FormField[] | FormColumn | FormColumn[];
type SchemaFormItemProps = {
  field: FormField;
  adapters: { [key: string]: TypeAdapter };
  validationAdapters: { [key: string]: ValidationAdapter };
  fieldData?: any;
  _adapters?: TypeAdapter[];
  _validationAdapters?: ValidationAdapter[];
  parentPath: NamePathArr;
};

const SchemaFormItem = (props: SchemaFormItemProps) => {
  const { field, adapters } = props;
  const fType = useMemo(() => {
    const fType = field.type;
    if (typeof fType === 'string') {
      return fType;
    }
    // eslint-disable-next-line no-prototype-builtins
    if (fType.hasOwnProperty('object')) {
      return 'object';
    }
    return 'array';
  }, [field.type]);
  const namePath: NamePath = useMemo(() => {
    const fName = props.fieldData?.name;
    if (fName === undefined) {
      return [field.id];
    }
    if (Array.isArray(fName)) {
      return [...(fName as any), field.id];
    }
    if (typeof fName === 'number') {
      return [fName];
    }
    return [fName as any, field.id];
  }, [field.id, props]);
  const options = useMemo(() => {
    if (
      !field.options?.rules ||
      field.options.rules.findIndex(
        // eslint-disable-next-line no-prototype-builtins
        (v: any) => v.hasOwnProperty('validator') && typeof v.validator === 'string',
      ) === -1
    ) {
      return field.options;
    }
    const options = { ...field.options };
    options.rules = options.rules.map((rule: any) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!rule.hasOwnProperty('validator') || typeof rule.validator !== 'string') {
        return rule;
      }

      const adapter = props.validationAdapters[rule.validator];
      if (adapter === undefined) {
        return rule;
      }
      const message = rule.message ? rule.message : adapter.message;
      return (form: FormInstance) => ({
        ...rule,
        message,
        validator: async (rule: any, value: any) => adapter.validator(rule, value, form),
      });
    });
    return options;
  }, [field.options, props.validationAdapters]);

  const addText = useMemo(() => {
    if (fType === 'array' && (field.type as any).addText) {
      return (field.type as any).addText;
    }
    return 'Add';
  }, [fType, field.type]);

  const adapter = useMemo(
    () => (adapters[fType] ? adapters[fType] : adapters['string']),
    [adapters, fType],
  );

  if (fType === 'array') {
    return (
      <AntdForm.Item label={field.name} {...options} name={namePath}>
        <AntdForm.List name={namePath}>
          {(fields, operation) => (
            <>
              {fields.map((f, i) => (
                <div style={{ display: 'flex', position: 'relative' }} key={i}>
                  <div style={{ flexGrow: 1 }}>
                    <SchemaFormItems
                      schema={[(field.type as any).array as FormField]}
                      fieldData={f}
                      adapters={props._adapters}
                      validationAdapters={props._validationAdapters}
                      parentPath={[...props.parentPath, props.field.id, i]}
                    />
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                  <div className="schema-form-array-remove" onClick={() => operation.remove(i)}>
                    <CloseCircleFilled />
                  </div>
                </div>
              ))}
              <Button
                type={'dashed'}
                style={{ display: 'block', width: '100%' }}
                onClick={() => operation.add(field.props?.defaultValue)}>
                <PlusOutlined />
                {addText}
              </Button>
            </>
          )}
        </AntdForm.List>
      </AntdForm.Item>
    );
  }
  if (fType === 'object') {
    return (
      <SchemaFormItems
        schema={(field.type as any).object as FormSchema}
        fieldData={{ name: namePath }}
        parentPath={[...props.parentPath]}
      />
    );
  }
  const COMP = adapter;
  return (
    <AntdForm.Item {...options} label={field.name} name={namePath}>
      <COMP {...field.props} />
    </AntdForm.Item>
  );
};

type SchemaFormFieldItemType = FormField | FormField[];
type SchemaFormItemGroupProps = {
  field: SchemaFormFieldItemType;
  adapters: { [key: string]: TypeAdapter };
  validationAdapters: { [key: string]: ValidationAdapter };
  fieldData?: any;
  _adapters?: TypeAdapter[];
  _validationAdapters?: ValidationAdapter[];
  parentPath: NamePathArr;
};
const SchemaFormItemGroup = (props: SchemaFormItemGroupProps) => {
  const { field, adapters } = props;
  if (Array.isArray(field)) {
    return (
      <Row gutter={16} style={{ flexGrow: 1 }}>
        {field.map((f, index) => (
          <Col {...f.layout} key={index}>
            <SchemaFormItem
              field={f}
              adapters={adapters}
              fieldData={props.fieldData}
              validationAdapters={props.validationAdapters}
              _adapters={props._adapters}
              _validationAdapters={props._validationAdapters}
              parentPath={props.parentPath}
            />
          </Col>
        ))}
      </Row>
    );
  }
  return (
    <SchemaFormItem
      field={field as FormField}
      adapters={adapters}
      fieldData={props.fieldData}
      validationAdapters={props.validationAdapters}
      _adapters={props._adapters}
      _validationAdapters={props._validationAdapters}
      parentPath={props.parentPath}
    />
  );
};

type SchemaFormFieldsProps = {
  schema: FormField[];
  adapters: { [key: string]: TypeAdapter };
  validationAdapters: { [key: string]: ValidationAdapter };
  fieldData?: any;
  _adapters?: TypeAdapter[];
  _validationAdapters?: ValidationAdapter[];
  parentPath: NamePathArr;
};

const SchemaFormFields: FC<SchemaFormFieldsProps> = (props) => {
  const { schema, adapters, validationAdapters } = props;
  const form = useContext(FormXContext);
  const fields = useMemo(() => {
    const f: SchemaFormFieldItemType[] = [];
    let group: FormField[] = [];
    for (const field of schema) {
      if (field.visible !== undefined) {
        if (typeof field.visible === 'boolean' && !field.visible) {
          continue;
        }
        if (
          typeof field.visible === 'function' &&
          !field.visible(form.value ? form.value : {}, form.form, props.parentPath)
        ) {
          continue;
        }
      }
      if (field.layout) {
        group.push(field);
      } else {
        if (group.length > 0) {
          f.push(group);
          group = [];
        }
        f.push(field);
      }
    }
    if (group.length > 0) {
      f.push(group);
    }
    return f;
  }, [form.form, form.value, props.parentPath, schema]);

  return (
    <>
      {fields.map((field, index) => (
        <SchemaFormItemGroup
          field={field}
          adapters={adapters}
          key={index}
          fieldData={props.fieldData}
          validationAdapters={validationAdapters}
          _adapters={props._adapters}
          _validationAdapters={props._validationAdapters}
          parentPath={props.parentPath}
        />
      ))}
    </>
  );
};

export const SchemaFormItems: FC<FormFieldsProps> = (props) => {
  const { schema } = props;
  const configCtx = useContext(SchemaFormConfigContext);
  const adapters = configCtx.adapters;

  const validationAdapters: { [key: string]: ValidationAdapter } = useMemo(() => {
    const ads: { [key: string]: ValidationAdapter } = {};
    configCtx.validators.forEach((value) => (ads[value.name] = value));
    if (props.validationAdapters) {
      props.validationAdapters.forEach((value) => (ads[value.name] = value));
    }
    return ads;
  }, [configCtx.validators, props.validationAdapters]);
  const [sch, typ] = useMemo(() => {
    const sx = Array.isArray(schema) ? schema : [schema];
    const ty = sx.length > 0 && sx[0].hasOwnProperty('fields') ? 'columns' : 'fields';
    return [sx, ty];
  }, [schema]);
  if (sch.length === 0) {
    return <></>;
  }

  if (typ === 'fields') {
    return (
      <SchemaFormFields
        schema={sch as FormField[]}
        adapters={adapters}
        validationAdapters={validationAdapters}
        fieldData={props.fieldData}
        _adapters={props.adapters}
        _validationAdapters={props.validationAdapters}
        parentPath={props.parentPath ? props.parentPath : []}
      />
    );
  }

  return (
    <Row gutter={16}>
      {(sch as FormColumn[]).map((value, index) => (
        <Col {...value.layout} key={index}>
          <SchemaFormFields
            schema={value.fields}
            adapters={adapters}
            validationAdapters={validationAdapters}
            fieldData={props.fieldData}
            parentPath={props.parentPath ? props.parentPath : []}
          />
        </Col>
      ))}
    </Row>
  );
};

export const Form: FC<FormProps> = (props) => {
  const [value, setValue] = useState<any>();
  const onValuesChange = useCallback(
    (changed: any, all: any) => {
      setValue(all);
      props.onValuesChange?.(changed, all);
    },
    [props],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <FormXContext.Provider value={{ value, form: props.form! }}>
      <AntdForm className="antd-schema-form" {...props} onValuesChange={onValuesChange}>
        {props.children}
      </AntdForm>
    </FormXContext.Provider>
  );
};
export default class SchemaForm {
  static Form = Form;
  static Item = AntdForm.Item;
  static Items = SchemaFormItems;
  static List = AntdForm.List;
  static ErrorList = AntdForm.ErrorList;
  static useForm = AntdForm.useForm;
  static Provider = AntdForm.Provider;
}
