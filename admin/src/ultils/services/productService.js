import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (n, p, c, s) => {
    try {
        const res = await httpRequest.get('v1/products', {
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
        const res = await httpRequest.deleted('v1/products', {
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
        const res = await httpRequest.post('v1/products', {
            name: req.title,
            category: parseInt(req.category_id, 10),
            img: req.avatar,
            description: "sadsadasdsad",
            priceRange: req.price,
            procedure: 1,
            status: req.status
        });
        
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/products/'+id, {
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
        const res = await httpRequest.update('v1/products', req);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
