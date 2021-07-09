import React, { ChangeEventHandler, FC } from 'react';

type HiddenInputProps = {
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const HiddenInput: FC<HiddenInputProps> = (props) => {
  return <input type="hidden" value={props.value} onChange={props.onChange} />;
};

type LabelInputProps = {
  value?: string;
  text: string;
};
export const LabelInput: FC<LabelInputProps> = (props) => {
  return <span {...props}>{props.text}</span>;
};
