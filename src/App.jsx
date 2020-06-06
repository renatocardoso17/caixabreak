import React, {useCallback, useEffect, useState} from "react";

import 'bootswatch/dist/slate/bootstrap.min.css';

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
    const [isAppReady, setAppReady] = useState(false);
    const [login, setLogin] = useState(loginDefaults);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [error, setError] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(undefined);
    const [showMovements, setShowMovements] = useState(false);
    const [period, setPeriod] = useState(undefined);

    const onSubmitHandler = useCallback(async (loginInfo) => {
        setIsLoading(true);
        setError(false);

        try {
            const { username, password } = loginInfo;

            const {
                balance = '',
                columns = [],
                rows = [],
                lastUpdate,
                periods
            } = await movementsService.getData(username, password, period);

            setData({
                balance,
                columns,
                rows,
                periods,
                lastUpdate: new Date(lastUpdate)
            });

            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error: ', error.message);
            setData(undefined);
            setPeriod(undefined);
            setError(error.response.data);
        } finally {
            setAppReady(true);
            setIsLoading(false);
        }

    }, [setData, setError, setIsLoading, setIsLoggedIn, period]);

    const onChangePeriodHandler = useCallback((value) => {
        setPeriod(value);
    }, []);

    //Show Login Form
    useEffect(() => {
        const show = !isLoading && !isLoggedIn;
        setShowLoginForm(show);
    }, [isLoggedIn, isLoading, setShowLoginForm]);

    //Show Table with Movement
    useEffect(() => {
        const show = !isLoading && isLoggedIn && data;
        setShowMovements(show);
    }, [isLoggedIn, isLoading, data, setShowMovements]);


    //Save credentials on Login
    useEffect(() => {
        if(isLoggedIn && login.rememberMe && data) {
            localStorageService.save({
                login,
                lastUpdate: data.lastUpdate,
                data,
            })
        }
    },[isLoggedIn, login, data]);

    //Read credentials from local storage
    useEffect(() => {
        const localStorageData = localStorageService.retrieve();
        if (localStorageData) {
            const loginInfo = {
                ...localStorageData.login
            };

            setLogin(loginInfo);
            onSubmitHandler(loginInfo);
        } else {
            setAppReady(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    //fetch movements on period change
    useEffect(() => {
        if (period && isLoggedIn) {
            onSubmitHandler(login);
        }
    }, [isLoggedIn, login, period, onSubmitHandler]);

    const onLoginChangeHandler = (id, value) => {
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
        setPeriod(undefined);
        setShowMovements(false);
    };

    return (
        <div className="app">
            <header className="app-header">
                <img src={logo} className="app-logo" width="85" height="50" alt="logo"/>
                {isAppReady && isLoggedIn && <div className="refresh-container">
                    <div onClick={() => onSubmitHandler(login)} title="Refresh" className="app-link">
                        <img src={refreshImg} alt="refresh" width={50} height={50}/>
                    </div>
                </div>}
                {isAppReady && isLoggedIn && <div className="logout-container">
                    <div onClick={logoutHandler} title="Sair" className="app-link">
                        <img src={logoutImg} alt="logout" width={40} height={40}/>
                    </div>
                </div>}
            </header>
            <div className="app-container">
                {(isLoading || !isAppReady) && <ReactLoading type="bars" color="#aaa" height={100} width={100} className="app-loading"/>}
                {isAppReady && showLoginForm && <Login
                    fields={login}
                    onChange={onLoginChangeHandler}
                    onSubmit={() => onSubmitHandler(login)}
                    error={error}
                />}
                {isAppReady && showMovements && <Movements
                    balance={data.balance}
                    columns={data.columns}
                    rows={data.rows}
                    selectedPeriod={period}
                    periods={data.periods}
                    lastUpdate={data.lastUpdate}
                    onChangePeriod={onChangePeriodHandler}
                />}
            </div>
        </div>
    )
};
export default App;
