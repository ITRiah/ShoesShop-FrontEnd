import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (n, p, c, s) => {
    try {
        const res = await httpRequest.get('v1/products/all', {
            params: {
                n: n,
                p: p,
                c: c,
                s: s,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('product/delete.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const create = async (req) => {
    try {
        const res = await httpRequest.post('product/post.php', req);
        console.log(res.data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('product/getbyid.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('product/update.php', req);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
