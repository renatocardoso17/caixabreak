import React, {useCallback} from 'react';
import PropTypes from 'prop-types';

import './Login.css';

const Login = ({fields, onChange, onSubmit, error}) => {
    const {username, password, rememberMe} = fields;

    const onChangeHandler = useCallback(event => {
        let {id, value, checked} = event.target;
        if (id === 'rememberMe') {
            value = checked
        }
        onChange(id, value)
    }, [onChange]);

    const onSubmitHandler = useCallback(onSubmit, [onSubmit]);

    return (
        <div className="form-signin">
            <h1 className="form-signin-title">CGD Portal Pré-pagos</h1>
            <label
                htmlFor="username"
                className="sr-only">
                Nº Adesão
            </label>
            <input
                className="form-control"
                id="username"
                type="text"
                placeholder="Nº Adesão"
                required
                autoFocus
                value={username}
                onChange={onChangeHandler}
            />
            <label
                htmlFor="password"
                className="sr-only">
                PIN
            </label>
            <input
                className="form-control"
                id="password"
                type="password"
                placeholder="PIN"
                required
                value={password}
                onChange={onChangeHandler}
            />

            <div className="checkbox mb-3">
                <label>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={onChangeHandler}/> Manter Autenticado
                </label>
            </div>

            <button className="btn btn-lg btn-primary login-button" onClick={onSubmitHandler}>Autenticar</button>
            {error && <div className="error">
                <span>{error}  asdoiasdjdasijjsad dasjasoidjpoadjs adsopsaipjdaspj adspojasdihsad</span>
            </div>}
        </div>
    );
};

Login.defaultProps = {
    fields: {
        username: '',
        password: '',
        rememberMe: false
    },
    error: undefined
};

Login.propTypes = {
    fields: PropTypes.shape({
        username: PropTypes.string,
        password: PropTypes.string,
        rememberMe: PropTypes.bool
    }).isRequired,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default Login;
