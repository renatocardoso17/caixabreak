import React from 'react';

export default function Information({ saldo, tableColumns, tableData }) {

    const renderTableHeader = () => {
        return tableColumns.map((column, index) => {
            return (
                <th key={index} scope="col">{column}</th>
            );
        });
    }

    const rendRowTable = () => {
        return tableData.map((row, index) => {
            return (
                <tr key={index}>
                    {renderColumnData(row)}
                </tr>
            )
        })
    };

    const renderColumnData = (data) => {
        return data.map((data, index) => {
            return (
                <td key={index}>{data}</td>
            )
        })
    }

    return (
        <div className="form-group overflow-none">
            <div className="form-group">
                <div className="d-flex">
                    <div style={{ marginTop: 15, marginBottom: 15, textAlign: 'center', width: 470 }}>
                        <h5>{`Saldo disponivel: ${saldo} €`}</h5>
                    </div>
                </div>
                <div className="table-responsive" /* text-nowrap */>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                {renderTableHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {rendRowTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}