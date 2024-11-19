import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import FormInput from '~/components/AuthForm/FormInput';
import { getbyid, update } from '~/ultils/services/userService';
import { getCookie } from '~/ultils/cookie';
import Button from '~/components/Button';

import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile() {
    const [user, setUser] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        avatar: '',
    });
    const [error, setError] = useState(null);

    const handleDeleteImg = () => {
        setUser((prevUser) => ({ ...prevUser, avatar: images.noImage }));
    };

    const handleUpdateAvatar = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            setUser((prevUser) => ({ ...prevUser, avatar: reader.result }));
        };
    };

    const handleUpdateUser = async () => {
        try {
            setError(null);
            const data = {
                id: getCookie('login').id,
                username: user.userName,
                first_name: user.firstName,
                last_name: user.lastName,
                phone: user.phone,
                email: user.email,
                address: user.address,
                avatar: user.avatar,
            };
            const response = await update(data);
            console.log(response);
            if (response.status === 'success') {
                setError(null);

                // Thành công, làm gì đó
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const response = await getbyid(getCookie('login').id);
                if (response.status === 'success') {
                    const data = response.data[0];
                    setUser({
                        userName: data.username,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        avatar: data.avatar,
                    });
                    setError(null);
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left')}>
                <div className={cx('avatar')}>
                    <img src={user.avatar} alt="avatar" />
                    <div className={cx('img-action')}>
                        <div onClick={handleDeleteImg}>Xóa</div>
                        <div>
                            <label htmlFor="avatar-input">Thay đổi</label>
                            <input type="file" id="avatar-input" onChange={handleUpdateAvatar} />
                        </div>
                    </div>
                </div>
                <div>Username: {user.userName}</div>
            </div>

            <div className={cx('right')}>
                <h3>Thông tin cá nhân</h3>
                <div className={cx('form')}>
                    <FormInput
                        type="text"
                        label="Họ"
                        value={user.lastName || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, lastName: e.target.value }));
                        }}
                    />
                    <FormInput
                        type="text"
                        label="Tên"
                        value={user.firstName || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, firstName: e.target.value }));
                        }}
                    />
                    <FormInput
                        type="text"
                        label="Điện thoại"
                        value={user.phone || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, phone: e.target.value }));
                        }}
                    />
                    <FormInput
                        type="text"
                        label="Email"
                        value={user.email || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, email: e.target.value }));
                        }}
                    />
                    <FormInput
                        type="text"
                        label="Địa chỉ"
                        value={user.address || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, address: e.target.value }));
                        }}
                    />
                </div>
                <Button primary onClick={handleUpdateUser}>
                    Sửa thông tin
                </Button>
            </div>
        </div>
    );
}

export default Profile;
