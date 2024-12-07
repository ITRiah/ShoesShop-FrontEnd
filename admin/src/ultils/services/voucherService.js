import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (fromDate, toDate) => {
    try {
        const res = await httpRequest.post('v1/vouchers/search', {
            dateFrom: fromDate,
            dateTo: toDate,
            role: "ADMIN"
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/vouchers/'+id, {});
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
        const res = await httpRequest.post('v1/vouchers', req);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('v1/vouchers', req);
        return res;
    } catch (e) {
        console.log(e);
    }
};
