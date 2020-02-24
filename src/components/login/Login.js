import React from 'react';

export default function Signup({ fields, handleFieldChange, onSubmit }) {

    return (
        <div className="container-sm" style={{ maxWidth: 400 }}>
            <div className="form-group">
                <label>Nº Adesão</label>
                <input
                    className="form-control"
                    id="user"
                    value={fields['user']}
                    onChange={handleFieldChange}
                />
            </div>
            <div className="form-group">
                <label>PIN</label>
                <input
                    className="form-control"
                    id="code"
                    type="password"
                    value={fields['code']}
                    onChange={handleFieldChange}
                />
            </div>
            <button
                className="btn btn-primary"
                onClick={onSubmit}>
                Consultar
            </button>
        </div>
    );
}