import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (n, s) => {
    //console.log(req);
    try {
        const res = await httpRequest.get('customer/getall.php', {
            params: {
                n: n,
                s: s,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const count = async () => {
    try {
        const res = await httpRequest.get('customer/count.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const topprice = async () => {
    try {
        const res = await httpRequest.get('customer/topprice.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('customer/getbyid.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyuser = async (user) => {
    try {
        const res = await httpRequest.get('customer/getbyusername.php', {
            params: {
                username: user,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('customer/update.php', req);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const register = async (req) => {
    try {
        const res = await httpRequest.post('v1/users', {
            firstname: req.first_name,
            lastname: req.last_name,
            email: req.email,
            password: req.password,
            username: req.username,
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

export const forgotPassword = async (req) => {
    try {
        const res = await httpRequest.post('v1/users/forgot-password?email=' + req.email, {});
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const updatePassword = async (req) => {
    try {
        const res = await httpRequest.update(
            'v1/users/password?email=' + req.email + '&password=' + req.password + '&otp=' + req.otp,
            {},
        );
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};
