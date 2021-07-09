// import { Icon as LegacyIcon } from '@ant-design/compatible';
import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  TreeSelect,
} from 'antd';
import React, { CSSProperties, FC, useMemo } from 'react';
import { FormInstance } from 'antd/es/form';
import { TypeAdapter, ValidationAdapter } from './Form';
import moment from 'moment';
import { HiddenInput, LabelInput } from './CommonInputs';

type BooleanInputProps = { value?: boolean; onChange?: (value?: boolean) => void };
// tslint:disable-next-line:variable-name
export const BooleanInput: FC<BooleanInputProps> = (props) => {
  return (
    <Checkbox
      checked={props.value === true}
      onChange={(e) => props.onChange && props.onChange(e.target.checked)}>
      {props.children}
    </Checkbox>
  );
};

export type MapPropsOptions = {
  map?: (props: any) => any;
  put?: Record<string, any>;
  remove?: string | string[];
  style?: CSSProperties;
  className?: string;
  encode?: (value: any) => any;
  decode?: (value: any) => any;
};

export const MapProps = (
  component: React.ComponentType,
  mapper: MapPropsOptions,
): React.ComponentType => {
  const Com = component;
  return (props) => {
    const newProps = useMemo(() => {
      const prps: any = mapper.put ? { ...mapper.put, ...props } : { ...props };
      if (mapper.remove) {
        if (Array.isArray(mapper.remove)) {
          mapper.remove.forEach((m) => delete prps[m]);
        } else {
          delete prps[mapper.remove];
        }
      }
      if (mapper.style) {
        prps.style = prps.style ? { ...mapper.style, ...prps.style } : mapper.style;
      }
      if (mapper.className) {
        prps.className = `${mapper.className} ${prps.className ?? ''}`.trim();
      }
      if (mapper.encode) {
        const onChange = prps.onChange;
        if (onChange) {
          prps.onChange = (value: any) => {
            if (value === undefined || value === null) {
              onChange(undefined);
            } else if (value.target !== undefined && value.target !== null) {
              onChange(
                value.target.value === undefined || value.target.value === null
                  ? undefined
                  : mapper.encode?.(value.target.value),
              );
            } else {
              onChange(mapper.encode?.(value));
            }
          };
        }
      }
      if (mapper.decode) {
        const value = prps.value;
        if (value !== undefined) {
          prps.value = mapper.decode(value);
        }
      }
      return mapper.map ? mapper.map(prps) : prps;
    }, [props]);
    return <Com {...newProps} />;
  };
};

const SelectPropsMapper = (props: any) => {
  if (props.options && Array.isArray(props.options) && props.options.length > 0) {
    console.log(typeof props.options);
    if (typeof props.options[0] === 'string') {
      props.options = props.options.map((opt: string) => ({ label: opt, value: opt }));
    }
  } else if (props.options && typeof props.options === 'object') {
    props.options = Object.entries(props.options).map((o) => ({ label: o[1], value: o[0] }));
  }
  return props;
};

export default class CommonAdapters {
  static typeAdapters: Record<string, TypeAdapter> = {
    string: Input,
    text: MapProps(Input.TextArea, { put: { autoSize: { minRows: 4, maxRows: 10 } } }),
    number: MapProps(InputNumber, { style: { display: 'block', width: '100%' } }),
    hidden: HiddenInput,
    label: LabelInput,
    email: MapProps(Input, { put: { type: 'email' } }),
    date: MapProps(DatePicker, {
      put: { format: 'DD/MM/YYYY' },
      encode: (value: any) => value.format('YYYY-MM-DD'),
      decode: (value: any) => moment(value),
    }),
    radio: Radio.Group,
    check: Checkbox.Group,
    boolean: BooleanInput,
    search: Input.Search,
    select: MapProps(Select, { map: SelectPropsMapper }),
    dateRange: MapProps(DatePicker.RangePicker, {
      put: { format: 'DD/MM/YYYY' },
      encode: (value: any) => value.map((val: any) => val.format('YYYY-MM-DD')),
      decode: (value: any) => value.map((val: string) => moment(val)),
    }),
    switch: MapProps(Switch as any, {
      map: (props) => {
        props.checked = props.value;
        return props;
      },
    }),
    rate: Rate,
    slider: Slider,
    time: TimePicker,
    tree: TreeSelect,
  };

  static all(_: boolean): any[] {
    return [
      {
        name: 'switch',
        // eslint-disable-next-line react/display-name
        render: (field: any) => {
          return <Switch {...field.props} />;
        },
      },
    ];
  }

  static allValidators(): ValidationAdapter[] {
    return [
      {
        name: 'equals',
        message: 'Should be equals',
        validator: async (rule: any, value: any, form: FormInstance) => {
          if (form.getFieldValue(rule.to) !== value) {
            throw Error('Not equal');
          }
        },
      },
      {
        name: 'nic',
        message: 'Should be a valid NIC',
        validator: async (_: any, value: any) => {
          if (value === undefined || value === '') {
            return;
          }
          const pattern = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/m;
          if (!value.match(pattern)) {
            throw Error('Not a NIC');
          }
          try {
            const datePart = value.substr(value.length === 10 ? 2 : 4, 3);
            let date = parseInt(datePart);
            if (date > 500) {
              date = date - 500;
            }
            if (date <= 0 || date > 366) {
              throw Error('Not a NIC');
            }
          } catch (e) {
            throw Error('Not a NIC');
          }
        },
      },
      {
        name: 'email',
        message: 'Should be valid E-mail',
        validator: async (_: any, value: any) => {
          if (value === undefined || value === '') {
            return;
          }
          const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/g;
          if (!value.match(pattern)) {
            throw Error('Not a Valid E-mail');
          }
        },
      },
      {
        name: 'plusNumber',
        message: 'Should be Positive value',
        validator: async (_: any, value: number) => {
          if (value === undefined || value === 0) {
            return;
          }
          if (+value < 0) {
            throw Error('Not a Positive Value');
          }
        },
      },
    ];
  }
}
