import get from 'lodash/get';
import find from 'lodash/find';
import React, {useCallback, useState} from 'react';
import './movements.css';
import PropTypes from "prop-types";
import {extractBalanceValueAndCurrency, formatFullDate, formatShortDate, formatCurrency, formatPeriod} from "../../utils/formatUtils";

const Movements = ({balance, columns, rows, lastUpdate, periods, selectedPeriod, onChangePeriod}) => {

    const defaultPeriod = selectedPeriod ? selectedPeriod : get(periods, [0, 'key']);
    const {balanceValue, balanceCurrency} = extractBalanceValueAndCurrency(balance);
    const [period, setPeriod] = useState(defaultPeriod);

    const periodValue = get(find(periods, ['key', period]), 'value');

    const onChangePeriodHandler = useCallback((value) => {
        setPeriod(value);
        onChangePeriod(value);
    }, [setPeriod, onChangePeriod]);

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
            <div className="periods-container">
                <div className="periods">
                    <div className="dropdown">
                        <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdown-periods" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {formatPeriod(periodValue)}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdown-periods">
                            { periods.map(({ key, value }) => <button key={key} className="dropdown-item" type="button" onClick={() => onChangePeriodHandler(key)}>{formatPeriod(value)}</button>) }
                        </div>
                    </div>
                </div>
                <div className="updated">
                    {`Últ. Act.: ${formatFullDate(lastUpdate)}`}
                </div>
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
