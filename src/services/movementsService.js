import axios from "axios";

const requestData = async (body) => {
    const {data} = await axios('/api', {
        method: 'post',
        data: body
    });
    return data;
};

const getData = (username, password, period) => {
    const params = {
        username,
        password
    };

    if (period) {
        params.period = period;
    }

    return requestData(params);
};

export default {getData};
