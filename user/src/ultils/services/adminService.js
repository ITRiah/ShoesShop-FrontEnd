import * as httpRequest from '~/ultils/httpRequest';

export const register = async (req) => {
    //console.log(req);
    try {
        const res = await httpRequest.post('cus/post.php', {
            first_name: req.firstName,
            last_name: req.lastName,
            role: 0,
            password: req.password,
            adminname: req.username,
            phone: req.phone,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req) => {
    try {
        const res = await httpRequest.post('admin/login.php', {
            adminname: req.username,
            password: req.password,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
