import { getCookie, deleteCookie } from '~/ultils/cookie';

import { getall } from '~/ultils/services/categoriesService';

export const isLogin = async () => {
    let data = getCookie('accessToken');

    const response = await getall('', '');
    if (response.status === 500) deleteCookie('accessToken');

    if (data) return true;
    else return false;
};
