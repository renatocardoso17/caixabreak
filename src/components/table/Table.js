import React from 'react';
import './table.css';

const Table = ({ balance, columns, rows, lastUpdate }) => {
    const appendLeadingZeroes = n => n <= 9 ? `0${n}` : n;
    const formatCurrency = value => Number(value).toFixed(2);
    const formatFullDate = value => {
        let datetime = new Date(lastUpdate);
        return   appendLeadingZeroes(datetime.getDate()) + "/" + appendLeadingZeroes(datetime.getMonth()+1) + "/" + datetime.getFullYear() + " " + appendLeadingZeroes(datetime.getHours()) + ":" + appendLeadingZeroes(datetime.getMinutes()) + ":" + appendLeadingZeroes(datetime.getSeconds());
    };
    const formatShortDate = value => {
        const date = value.split('-');
        const year = date[2].substring(4, 2);
        return `${date[0]}/${date[1]}/${year}`;
    };

    const balanceValue = balance.match(/[0-9]+\.[0-9]*/)[0];
    const balanceCurrency = balance.match(/[a-zA-Z]+/)[0];
    const updateDate = formatFullDate(lastUpdate);

    const renderTableHeader = () => {
        return columns.map((column, index) => {
            return (
                <th key={index} scope="col" className={`table-column-header column-${index}`}>{column}</th>
            );
        });
    };

    const renderRowTable = () => {
        return rows.map((row, index) => {
            return (
                <tr key={index} >
                    {renderColumnData(row)}
                </tr>
            )
        })
    };

    const renderColumnData = data => {
        return data.map((data, index) => {

            let value = data;
            if (index === 0) {
                value = formatShortDate(data);
            }
            if (index === 2) {
                value = formatCurrency(data);
            }
            return (
                <td key={index} className={`table-column column-${index}`}>{value}</td>
            )
        })
    };

    return (
        <div className="form-group overflow-none">
            <div className="form-group">
                <div className="balance">
                    <div className="balance-label">Saldo disponível:</div>
                    <div className="balance-value">{`${balanceValue} ${balanceCurrency}`}</div>
                </div>
                <div className="updated">
                    {`Últ. Act.: ${updateDate}`}
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
};

export default Table;
