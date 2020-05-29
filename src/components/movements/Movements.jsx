import React from 'react';
import './movements.css';
import PropTypes from "prop-types";
import {extractBalanceValueAndCurrency, formatFullDate, formatShortDate, formatCurrency} from "../../utils/formatUtils";

const Movements = ({balance, columns, rows, lastUpdate}) => {
    const {balanceValue, balanceCurrency} = extractBalanceValueAndCurrency(balance);

    const renderTableHeader = () => columns.map((column, index) => (
        <th key={index} scope="col" className={`table-column-header column-${index}`}>{column}</th>
    ));

    const renderColumnData = data => data.map((data, index) => {
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
    });

    const renderRowTable = () => rows.map((row, index) => (
        <tr key={index}>
            {renderColumnData(row)}
        </tr>
    ));

    return (
        <div className="movements">
            <div className="balance">
                <div className="balance-label">Saldo disponível:</div>
                <div className="balance-value">{`${balanceValue} ${balanceCurrency}`}</div>
            </div>
            <div className="updated">
                {`Últ. Act.: ${formatFullDate(lastUpdate)}`}
            </div>
            <div className="table-responsive">
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
    );
};

Movements.propTypes = {
    balance: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    lastUpdate: PropTypes.object.isRequired
};

export default Movements;
