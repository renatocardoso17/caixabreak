import React from 'react';

export default function Information({ balance, columns, rows, lastUpdate }) {

    const renderTableHeader = () => {
        return columns.map((column, index) => {
            return (
                <th key={index} scope="col">{column}</th>
            );
        });
    };

    const renderRowTable = () => {
        return rows.map((row, index) => {
            return (
                <tr key={index}>
                    {renderColumnData(row)}
                </tr>
            )
        })
    };

    const renderColumnData = data => {
        return data.map((data, index) => {
            return (
                <td key={index}>{data}</td>
            )
        })
    };

    return (
        <div className="form-group overflow-none">
            <div className="form-group">
                <div className="d-flex">
                    <div style={{ marginTop: 15, marginBottom: 15, textAlign: 'right', width: '100%' }}>
                        <h5>{`Última Actualização: ${lastUpdate}`}</h5>
                    </div>
                </div>
                <div className="d-flex">
                    <div style={{ marginTop: 15, marginBottom: 15, textAlign: 'right', width: '100%' }}>
                        <h5>{`Saldo disponível: ${balance}`}</h5>
                    </div>
                </div>
                <div className="table-responsive" /* text-nowrap */>
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                {renderTableHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {renderRowTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}