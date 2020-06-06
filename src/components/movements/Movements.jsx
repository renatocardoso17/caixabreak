import get from 'lodash/get';
import React, {useCallback, useState} from 'react';
import './movements.css';
import PropTypes from "prop-types";
import {extractBalanceValueAndCurrency, formatFullDate, formatShortDate, formatCurrency, formatPeriod} from "../../utils/formatUtils";

const Movements = ({balance, columns, rows, lastUpdate, periods, selectedPeriod, onChangePeriod, isOnline}) => {

    const defaultPeriod = selectedPeriod ? selectedPeriod : get(periods, [0, 'key']);
    const {balanceValue, balanceCurrency} = extractBalanceValueAndCurrency(balance);
    const [period, setPeriod] = useState(defaultPeriod);

    const onChangePeriodHandler = useCallback(({ target: { value }}) => {
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
                <div className="periods dropdown">
                    <select value={period} disabled={!isOnline} onChange={onChangePeriodHandler} className="dropdown-select btn btn-primary btn-sm">
                        { periods.map(({ key, value }) => <option key={key} value={key} className="dropdown-option">{formatPeriod(value)}</option>) }
                    </select>
                </div>
                <div className="updated">
                    {`Últ. Act.: ${formatFullDate(lastUpdate)}`}
                </div>
            </div>
            {
                rows.length > 0 ? <div className="table-responsive">
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
                </div> : <div className="alert alert-primary" role="alert">Não existem movimentos</div>
            }
        </div>
    );
};

Movements.propTypes = {
    isOnline: PropTypes.bool.isRequired,
    balance: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    periods: PropTypes.array.isRequired,
    lastUpdate: PropTypes.object.isRequired,
    onChangePeriod: PropTypes.func.isRequired
};

export default Movements;
