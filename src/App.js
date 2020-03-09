import React from 'react';
import ReactLoading from 'react-loading';
import logo from './logo-50.png';
import refreshImg from './refresh.svg';
import logoutImg from './logout.svg';
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
                    {this.state.data && <div className="refresh-container">
                        {this.state.data &&  <div onClick={this.onSubmit} title="Refresh" className="app-link">
                            <img src={refreshImg} alt="refresh" width={50} height={50}/>
                        </div>}
                    </div>}
                    {this.state.data && <div className="logout-container">
                        <div onClick={this.logout} title="Sair" className="app-link">
                            <img src={logoutImg} alt="logout" width={40} height={40} />
                        </div>
                    </div>}
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
