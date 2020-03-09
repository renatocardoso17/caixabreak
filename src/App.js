import React from 'react';
import ReactLoading from 'react-loading';
import logo from './logo-50.png';
import localStorageService from "./components/localstorage/localStorageService";
import movementsService from "./components/movements/movementsService";
import Table from './components/table/Table';
import Login from './components/login/Login';


import './App.css';
import "bootswatch/dist/slate/bootstrap.min.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            loading: false,
            fields: {
                username: '',
                password: '',
                memorize: false
            }
        };
        const caixaLocalStorageData = localStorageService.retrieve();
        if (caixaLocalStorageData) {
            this.state = {
                loading: true,
                fields: {
                    username: caixaLocalStorageData.userDetails.username,
                    password: caixaLocalStorageData.userDetails.password,
                    memorize: true
                },
                data: undefined,
                error: undefined
            };
            this.getData().then(response =>
                this.setState({
                    ...this.state,
                    loading: false,
                    data: {
                        balance: response.balance,
                        columns: response.columns,
                        rows: response.rows,
                        lastUpdate: new Date(response.lastUpdate)
                    }
                })
            ).catch(e => {
                console.log('Error: ', e.message);
                this.setState({
                    ...this.state,
                    loading: false,
                    data: undefined,
                    error: e.response.data
                });
            });
        }
    }

    handleFieldChange(event) {
        this.setState({
            ...this.state,
            fields: {
                ...this.state.fields,
                [event.target.id]: event.target.value
            }
        });
    }

    handleCheckChange(event) {
        this.setState({
            ...this.state,
            fields: {
                ...this.state.fields,
                [event.target.id]: event.target.checked
            }
        });
    }

    logout() {
        this.setState({
            ...this.state,
            loading: false,
            fields: {
                username: '',
                password: '',
                memorize: false
            },
            data: undefined,
            error: undefined
        });
        localStorageService.clear();
    }

    async onSubmit(event) {
        event.preventDefault();
        this.setState({
            ...this.state,
            loading: true,
            data: undefined,
            error: undefined
        });
        this.getData()
            .then(response =>
                this.setState({
                    ...this.state,
                    loading: false,
                    data: {
                        balance: response.balance,
                        columns: response.columns,
                        rows: response.rows,
                        lastUpdate: new Date(response.lastUpdate)
                    }
                }))
            .catch(e => {
                this.setState({
                    ...this.state,
                    loading: false,
                    data: undefined,
                    error: e.response.data
                });
            });
    }

    async getData() {
        const {username, password, memorize} = this.state.fields;
        const response = await movementsService.getData(username, password);
        if (memorize) {
            localStorageService.save({
                userDetails: {
                    username,
                    password
                },
                lastUpdate: new Date(response.lastUpdate),
                data: response
            });
        } else {
            localStorageService.clear();
        }
        return response;
    }

    render() {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} className="app-logo" width="85" height="50" alt="logo"/>
                    <div className="refresh-container">
                        {this.state.data &&  <a onClick={() => window.location.reload()} title="Refresh" className="app-link">
                            <svg className="svg-icon svg-refresh" viewBox="0 0 20 20">
                                <path fill="none" d="M19.305,9.61c-0.235-0.235-0.615-0.235-0.85,0l-1.339,1.339c0.045-0.311,0.073-0.626,0.073-0.949
								c0-3.812-3.09-6.901-6.901-6.901c-2.213,0-4.177,1.045-5.44,2.664l0.897,0.719c1.053-1.356,2.693-2.232,4.543-2.232
								c3.176,0,5.751,2.574,5.751,5.751c0,0.342-0.037,0.675-0.095,1l-1.746-1.39c-0.234-0.235-0.614-0.235-0.849,0
								c-0.235,0.235-0.235,0.615,0,0.85l2.823,2.25c0.122,0.121,0.282,0.177,0.441,0.172c0.159,0.005,0.32-0.051,0.44-0.172l2.25-2.25
								C19.539,10.225,19.539,9.845,19.305,9.61z M10.288,15.752c-3.177,0-5.751-2.575-5.751-5.752c0-0.276,0.025-0.547,0.062-0.813
								l1.203,1.203c0.235,0.234,0.615,0.234,0.85,0c0.234-0.235,0.234-0.615,0-0.85l-2.25-2.25C4.281,7.169,4.121,7.114,3.961,7.118
								C3.802,7.114,3.642,7.169,3.52,7.291l-2.824,2.25c-0.234,0.235-0.234,0.615,0,0.85c0.235,0.234,0.615,0.234,0.85,0l1.957-1.559
								C3.435,9.212,3.386,9.6,3.386,10c0,3.812,3.09,6.901,6.902,6.901c2.083,0,3.946-0.927,5.212-2.387l-0.898-0.719
								C13.547,14.992,12.008,15.752,10.288,15.752z"></path>
                            </svg>
                        </a>}
                    </div>
                    <div className="logout-container">
                        {this.state.data && <a onClick={this.logout} title="Sair" className="app-link">
                            <svg className="svg-icon svg-logout" viewBox="0 0 20 20">
                                <path fill="none" d="M13.53,2.238c-0.389-0.164-0.844,0.017-1.01,0.41c-0.166,0.391,0.018,0.845,0.411,1.01
								c2.792,1.181,4.598,3.904,4.6,6.937c0,4.152-3.378,7.529-7.53,7.529c-4.151,0-7.529-3.377-7.529-7.529
								C2.469,7.591,4.251,4.878,7.01,3.683C7.401,3.515,7.58,3.06,7.412,2.67c-0.17-0.392-0.624-0.571-1.014-0.402
								c-3.325,1.44-5.472,4.708-5.47,8.327c0,5.002,4.069,9.071,9.071,9.071c5.003,0,9.073-4.07,9.073-9.071
								C19.07,6.939,16.895,3.659,13.53,2.238z"></path>
                                <path fill="none" d="M9.999,7.616c0.426,0,0.771-0.345,0.771-0.771v-5.74c0-0.426-0.345-0.771-0.771-0.771
								c-0.427,0-0.771,0.345-0.771,0.771v5.74C9.228,7.271,9.573,7.616,9.999,7.616z"></path>
                            </svg>
                        </a>}
                    </div>
                </header>
                {this.state.loading && <ReactLoading type="bars" color="#aaa" height={100} width={100} className="app-Loading"/>}
                <div className="app-container">
                    {!this.state.loading && !this.state.data && <Login
                        fields={this.state.fields}
                        handleFieldChange={this.handleFieldChange}
                        handleCheckChange={this.handleCheckChange}
                        onSubmit={this.onSubmit}
                    />}
                    {this.state.error && <div className="error">
                        <span>{this.state.error}</span>
                    </div>}
                    {!this.state.loading && this.state.data && <Table
                        balance={this.state.data.balance || 0}
                        columns={this.state.data.columns || []}
                        rows={this.state.data.rows || []}
                        lastUpdate={this.state.data.lastUpdate}
                    />}
                </div>
            </div>
        );
    }
}


export default App;
