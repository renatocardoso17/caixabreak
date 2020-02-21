import React from 'react';
import logo from './logo512.png';
import { useFormFields } from "./components/hooks/useFormField";
import Table from './components/table/Table';
import Login from './components/login/Login';

import './App.css';
import "bootswatch/dist/slate/bootstrap.min.css";


const columns = [
    'Data',
    'Data valor',
    'Descrição',
    'Débito',
    'Crédito'
];

const tableData = [
    ['02-11-2019', '02-11-2019', 'asdasd', '400', '400'],
    ['03-10-2019', '02-11-2019', 'asdasd', '500', '500'],
    ['04-09-2019', '02-11-2019', 'asdasd', '20', '20'],
    ['12-04-2019', '02-11-2019', 'asdasd', '450', '450'],
    ['15-02-2019', '02-11-2019', 'asdasd', '65', '65'],
    ['31-08-2019', '02-11-2019', 'asdasd', '1500', '1500'],
    ['23-06-2019', '02-11-2019', 'asdasd', '1111', '1111'],
    ['32-04-2019', '02-11-2019', 'asdasd', '12', '12'],
    ['30-12-2019', '02-11-2019', 'asdasd', '1', '1']
];

function App() {
    const [fields, handleFieldChange, reset] = useFormFields({
        user: "",
        code: ""
    });

    const onSubmit = () => {
        /**
         * Do axios request here
         */
        console.log(fields);
        reset({
            user: '',
            code: ''
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div className="container">
                    <Login
                        fields={fields}
                        handleFieldChange={handleFieldChange}
                        onSubmit={onSubmit}
                    />
                    <Table
                        saldo={400}
                        tableColumns={columns}
                        tableData={tableData}
                    />
                </div>
            </header>
        </div>
    );
}

export default App;
