const retrieve = () => JSON.parse(localStorage.getItem('caixabreak'));

const save = (dataToSave) => {
    localStorage.setItem('caixabreak', JSON.stringify(dataToSave));
};

const clear = () => {
    localStorage.removeItem('caixabreak');
};

export default {retrieve, save, clear};