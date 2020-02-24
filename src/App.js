import React, { useState } from 'react';
import logo from './logo512.png';
import { useFormFields } from "./components/hooks/useFormField";
import Table from './components/table/Table';
import Login from './components/login/Login';
import { service } from './components/service';

import './App.css';
import "bootswatch/dist/slate/bootstrap.min.css";


// const columns = [
//     'Data',
//     'Data valor',
//     'Descrição',
//     'Débito',
//     'Crédito'
// ];

// const tableData = [
//     ['02-11-2019', '02-11-2019', 'asdasd', '400', '400'],
//     ['03-10-2019', '02-11-2019', 'asdasd', '500', '500'],
//     ['04-09-2019', '02-11-2019', 'asdasdasdasdasd  asd sda das das d', '20', '20'],
//     ['12-04-2019', '02-11-2019', 'asdasd as dsa da sd sdad ', '450', '450'],
//     ['15-02-2019', '02-11-2019', 'asdasd', '65', '65'],
//     ['31-08-2019', '02-11-2019', 'asdasd', '1500', '1500'],
//     ['23-06-2019', '02-11-2019', 'asdasd', '1111', '1111'],
//     ['32-04-2019', '02-11-2019', 'asdasd', '12', '12'],
//     ['30-12-2019', '02-11-2019', 'asdasd', '1', '1']
// ];

function App() {
    const [fields, handleFieldChange, reset] = useFormFields({
        user: "",
        code: ""
    });
    const [data, setData] = useState();

    const onSubmit = () => {

        const data = service(fields.user, fields.code);
        setData({
            saldo: data.balance,
            tableColumns: data.columns,
            tableData: data.rows
        })
        console.log(data);
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
                    {data && <Table
                        saldo={data.balance || 0}
                        tableColumns={data.columns || []}
                        tableData={data.rows || []}
                    />}
                </div>
            </header>
        </div>
    );
}

export default App;
