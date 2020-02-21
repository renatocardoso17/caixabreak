import React from 'react';

export default function Information({ saldo, tableColumns, tableData }) {

    const renderTableHeader = () => {
        return tableColumns.map((column, index) => {
            return (
                <th className="th-lg" key={index} scope="col">{column}</th>
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
        <div className="form-group overflow-auto">
            <div className="form-group">
                <div className="d-flex">
                    <div style={{ marginTop: 15, marginBottom: 15, textAlign: 'center', width: 470 }}>
                        <h4>{`Saldo disponivel: ${saldo} €`}</h4>
                    </div>
                </div>
                <small>Valor em EUR</small>
                <div className="table-responsive w-auto text-nowrap">
                    <table className="table">
                        <thead className="thead-dark">
                            <tr className="tr-lg">
                                {renderTableHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {rendRowTable()}
                        </tbody>
                        <tfoot className="tfoot-dark">
                            <tr>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col">Total</th>
                                <th scope="col">10000</th>
                                <th scope="col">600</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}