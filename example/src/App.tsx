import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import SchemaForm, { Form } from '@sezenta/schema-form';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Button type={'primary'}>GRRRRRRRRR</Button>
        <Form
          initialValues={{ age: true }}
          onValuesChange={(changedValues: any, values: any) => console.log(values)}>
          <SchemaForm.Items
            schema={[
              {
                name: 'Name',
                id: 'name',
                type: 'slider',
                props: { options: ['Name', 'Age'] },
              },
              {
                name: 'Age',
                id: 'age',
                type: 'switch',
                props: { options: { one: 'One', two: 'Two' } },
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
