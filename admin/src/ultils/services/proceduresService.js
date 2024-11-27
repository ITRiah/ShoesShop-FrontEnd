import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (s, n) => {
    try {
        const res = await httpRequest.get('v1/procedures', {
            params: {
                s: s,
                n: n,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/procedures/'+id, {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('category/delete.php', {
            params: {
                id: id,
            },
        });
        console.log(res.data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const create = async (req) => {
    try {
        const res = await httpRequest.post('v1/procedures', req);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('category/update.php', req);
        return res;
    } catch (e) {
        console.log(e);
    }
};
