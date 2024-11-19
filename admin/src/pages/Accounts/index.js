import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { v4 } from 'uuid';

import styles from './Accounts.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Table2 from '~/components/Table2';
import Ellipsis from '~/components/Ellipsis';
import FormFilter from './FormFilter';
import { getall, update } from '~/ultils/services/userService';
import FormAccount from './FormAccount';

const cx = classNames.bind(styles);

//let rows;

function Accounts() {
    const [rows, setRows] = useState([]);
    const [updating, setUpdating] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [idShow, setIdShow] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getall(name, status);
                if (response.status === 'fail') {
                    setRows([]);
                } else {
                    const newData = response.data.map(
                        ({ id, username, first_name: firstName, last_name: lastName, phone, email, status }) => {
                            const menu = [
                                {
                                    title: 'Chi tiết',
                                    onClick: () => {
                                        setIdShow(id);
                                    },
                                },
                                {
                                    title: status === '1' ? 'Disable' : 'Enable',
                                    onClick: async () => {
                                        const response = await update({
                                            id: id,
                                            status: !parseInt(status),
                                        });
                                        if (response.status === 'success') {
                                            setUpdating(v4());
                                        }
                                    },
                                },
                            ];
                            return {
                                id,
                                username,
                                firstName,
                                lastName,
                                phone,
                                email,
                                status:
                                    status === '1' ? (
                                        <span className="success">Enable</span>
                                    ) : (
                                        <span className="error">Disabled</span>
                                    ),
                                action: <Ellipsis type2 menu={menu} />,
                            };
                        },
                    );
                    setRows(newData);
                }
            } catch (error) {
                // Xử lý lỗi khi gọi API
                console.log(error);
            }
        };
        fetchData();
    }, [updating, name, status]);

    const col = [
        {
            field: 'ID',
            width: 40,
        },
        {
            field: 'User Name',
            width: 120,
        },
        {
            field: 'First Name',
            width: 120,
        },
        {
            field: 'Last Name',
            width: 120,
        },
        {
            field: 'Phone',
            width: 110,
        },
        {
            field: 'Email',
            width: 200,
        },
        {
            field: 'Status',
            width: 80,
        },
        {
            field: 'Action',
            width: 70,
        },
    ];

    return (
        <div>
            {idShow && (
                <FormAccount
                    id={idShow}
                    onClose={() => {
                        setIdShow('');
                    }}
                />
            )}
            <WhiteBG title="Quản Lý Tài Khoản">
                <div className={cx('wrapper')}>
                    <div className={cx('listUser')}>
                        <div className={cx('table')}>
                            <Table2 rows={rows} colum={col} />
                        </div>
                        <div className={cx('filter')}>
                            <FormFilter
                                search={(n, s) => {
                                    setName(n);
                                    setStatus(s);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Accounts;
