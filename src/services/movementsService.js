import axios from "axios";

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

const getData = (username, password) => {
    return requestData(username, password);
};

export default {getData};
