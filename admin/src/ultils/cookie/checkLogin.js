import { getCookie } from '~/ultils/cookie';

export const isLogin = () => {
    let data = getCookie('login');

    if (data) return true;
    else return false;
};
