import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (s, n) => {
    try {
        const res = await httpRequest.post('v1/categories/search', {
            name: n
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/categories/'+id, {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('v1/categories', {
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
        const res = await httpRequest.post('v1/categories', {
            name: req.name,
            img: req.image
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('v1/categories', {
            id: req.id,
            name: req.name,
            img: req.image
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};
