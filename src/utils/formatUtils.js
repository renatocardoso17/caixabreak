export const appendLeadingZeroes = n => n <= 9 ? `0${n}` : n;

export const formatCurrency = value => Number(value).toFixed(2);

export const formatFullDate = value => {
    let datetime = new Date(value);
    return   appendLeadingZeroes(datetime.getDate()) + "/" + appendLeadingZeroes(datetime.getMonth()+1) + "/" + datetime.getFullYear() + " " + appendLeadingZeroes(datetime.getHours()) + ":" + appendLeadingZeroes(datetime.getMinutes()) + ":" + appendLeadingZeroes(datetime.getSeconds());
};

export const formatShortDate = value => {
    const date = value.split('-');
    const year = date[2].substring(4, 2);
    return `${date[0]}/${date[1]}/${year}`;
};

export const extractBalanceValueAndCurrency = balance => {
    const balanceValue = balance.match(/[0-9]+\.[0-9]*/)[0];
    const balanceCurrency = balance.match(/[a-zA-Z]+/)[0];
    return {
        balanceValue,
        balanceCurrency
    }
};
