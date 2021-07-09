import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SchemaFormConfig } from '@sezenta/schema-form';
import { Input } from 'antd';

ReactDOM.render(
  <React.StrictMode>
    <SchemaFormConfig adapters={{ password: Input.Password }}>
      <App />
    </SchemaFormConfig>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
