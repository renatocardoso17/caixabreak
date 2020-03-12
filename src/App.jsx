import React, {useCallback, useEffect, useState} from "react";

import "bootswatch/dist/slate/bootstrap.min.css";
import './App.css';
import logo from "./logo-50.png";
import refreshImg from "./refresh.svg";
import logoutImg from "./logout.svg";
import ReactLoading from "react-loading";
import Login from "./components/login/Login";
import Movements from "./components/movements/Movements";
import localStorageService from "./services/localStorageService";
import movementsService from "./services/movementsService";

const App = () => {
    const loginDefaults = {
        username: '',
        password: '',
        rememberMe: false
    };
    const [login, setLogin] = useState(loginDefaults);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [error, setError] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(undefined);
    const [showTable, setShowTable] = useState(false);


    const onSubmitHandler = useCallback(async () => {
        setIsLoading(true);
        setError(false);

        try {
            const { username, password } = login;
            const {balance = '', columns = [], rows = [], lastUpdate} = await movementsService.getData(username, password);

            setData({
                balance,
                columns,
                rows,
                lastUpdate: new Date(lastUpdate)
            });

            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error: ', error.message);
            setData(undefined);
            setError(error.response.data);
        } finally {
            setIsLoading(false);
        }

    }, [login]);

    //Show Login Form
    useEffect(() => {
        const show = !isLoading && !isLoggedIn;
        setShowLoginForm(show);
    }, [isLoggedIn, isLoading, setShowLoginForm]);

    //Show Table with Movement
    useEffect(() => {
        const show = !isLoading && isLoggedIn && data;
        setShowTable(show);
    }, [isLoggedIn, isLoading, data, setShowTable]);


    //Save credentials on Login
    useEffect(() => {
        if(isLoggedIn && login.rememberMe && data) {
            const { username, password, rememberMe} = login;
            localStorageService.save({
                login: {
                    username,
                    password,
                    rememberMe,
                },
                lastUpdate: data.lastUpdate,
                data,
            })
        }
    },[isLoggedIn, login, data]);

    //Read credentials from local storage
    useEffect(() => {
        const localStorageData = localStorageService.retrieve();
        if (localStorageData) {
            setLogin({
                ...localStorageData.login
            });
            onSubmitHandler();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const onChangeHandler = (id, value) => {
        setLogin({
            ...login,
            [id]: value
        });
    };

    const logoutHandler = () => {
        localStorageService.clear();
        setLogin(loginDefaults);
        setIsLoggedIn(false);
        setError(undefined);
        setIsLoading(false);
        setData(undefined);
        setShowTable(false);
    };

    return (
        <div className="app">
            <header className="app-header">
                <img src={logo} className="app-logo" width="85" height="50" alt="logo"/>
                {isLoggedIn && <div className="refresh-container">
                    <div onClick={() => window.location.reload()} title="Refresh" className="app-link">
                        <img src={refreshImg} alt="refresh" width={50} height={50}/>
                    </div>
                </div>}
                {isLoggedIn && <div className="logout-container">
                    <div onClick={logoutHandler} title="Sair" className="app-link">
                        <img src={logoutImg} alt="logout" width={40} height={40}/>
                    </div>
                </div>}
            </header>
            <div className="app-container">
                {isLoading && <ReactLoading type="bars" color="#aaa" height={100} width={100} className="app-Loading"/>}
                {showLoginForm && <Login
                    fields={login}
                    onChange={onChangeHandler}
                    onSubmit={onSubmitHandler}
                />}
                {error && <div className="error">
                    <span>{error}</span>
                </div>}
                {showTable && <Movements
                    balance={data.balance}
                    columns={data.columns}
                    rows={data.rows}
                    lastUpdate={data.lastUpdate}
                />}
            </div>
        </div>
    )
};
export default App;
