import React from 'react';

import './Login.css';

export default function Signup({ fields, handleFieldChange, handleCheckChange, onSubmit }) {

    return (
        <form className="form-signin" onSubmit={onSubmit}>
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
                value={fields['username']}
                onChange={handleFieldChange}
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
                value={fields['password']}
                onChange={handleFieldChange}
            />

            <div className="checkbox mb-3">
                <label>
                    <input
                        type="checkbox"
                        id="memorize"
                        checked={fields['memorize']}
                        onChange={handleCheckChange} /> Manter Autenticado
                </label>
            </div>

            <input className="btn btn-lg btn-primary login-button" type="submit" value="Autenticar" />
        </form>
    );
}
