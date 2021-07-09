import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import SchemaForm, { Form, useForm } from '@sezenta/antd-schema-form';

function App() {
  const [form] = useForm();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Button type={'primary'} onClick={form.submit}>
          GRRRRRRRRR
        </Button>
        <Form
          form={form}
          style={{ width: 300, margin: 'auto', border: '1px solid blue' }}
          layout={'vertical'}
          onValuesChange={(changedValues: any, values: any) => console.log(values)}>
          <SchemaForm.Items
            schema={[
              {
                name: 'Name',
                id: 'name',
                type: 'string',
                props: { options: ['Name', 'Age'] },
              },
              {
                name: 'Age',
                id: 'age',
                type: 'phone',
                props: { defaultCountry: 'LK' },
                options: {
                  rules: [
                    { required: true, message: 'Phone is required' },
                    { validator: 'phone', message: 'Invalid phone number' },
                  ],
                },
              },
            ]}
          />
        </Form>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
