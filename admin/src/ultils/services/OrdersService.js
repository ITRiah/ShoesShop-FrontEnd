import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (id, t) => {
    try {
        const res = await httpRequest.get('v1/orders', {
            params: {
                id: id,
                t: t,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getrecents = async () => {
    try {
        const res = await httpRequest.get('orders/getrecents.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const count = async () => {
    try {
        const res = await httpRequest.get('orders/count.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('orders/getbyid.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('orders/delete.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
