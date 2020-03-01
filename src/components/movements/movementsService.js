import axios from "axios";

const getData = (username, password) => {
    return requestData(username, password);
};

const requestData = async (username, password) => {
    const {data} = await axios('/api', {
        method: 'post',
        data: {
            username,
            password
        }
    });
    return data;
};

export default {getData};