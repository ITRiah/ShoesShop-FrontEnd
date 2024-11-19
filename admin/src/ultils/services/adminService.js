import * as httpRequest from '~/ultils/httpRequest';

export const register = async (req) => {
    //console.log(req);
    try {
        const res = await httpRequest.post('v1/users', {
            firstname: req.firstName,
            lastname: req.lastName,
            password: req.password,
            username: req.username,
            email: req.email,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req) => {
    try {
        const res = await httpRequest.post('login', {
            username: req.username,
            password: req.password,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
