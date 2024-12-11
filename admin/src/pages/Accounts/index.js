import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { v4 } from 'uuid';

import styles from './Accounts.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Table2 from '~/components/Table2';
import Ellipsis from '~/components/Ellipsis';
import FormFilter from './FormFilter';
import { getall, block } from '~/ultils/services/userService';
import FormAccount from './FormAccount';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

//let rows;

function Accounts() {
    const [rows, setRows] = useState([]);
    const [updating, setUpdating] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [role, setRole] = useState('');
    const [idShow, setIdShow] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getall(name, role);

                console.log(response);

                if (response.statusCode !== 200) {
                    setRows([]);
                } else {
                    const newData = response.result.map(({ id, username, firstName, lastName, email, isDeleted }) => {
                        const menu = [
                            {
                                title: 'Chi tiết',
                                onClick: () => {
                                    setIdShow(id);
                                },
                            },
                            {
                                title: !isDeleted ? 'Block' : 'Unblock',
                                onClick: async () => {
                                    const response = await block({
                                        id: id,
                                    });
                                    if (response.statusCode === 201) {
                                        toast.success(response.message);
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
                            email,
                            status: !isDeleted ? (
                                <span className="success">Active</span>
                            ) : (
                                <span className="error">Blocked</span>
                            ),
                            action: <Ellipsis type2 menu={menu} />,
                        };
                    });
                    setRows(newData);
                }
            } catch (error) {
                // Xử lý lỗi khi gọi API
                console.log(error);
            }
        };
        fetchData();
    }, [updating, name, role]);

    const col = [
        {
            field: 'ID',
            width: 50,
        },
        {
            field: 'User Name',
            width: 140,
        },
        {
            field: 'First Name',
            width: 135,
        },
        {
            field: 'Last Name',
            width: 135,
        },
        {
            field: 'Email',
            width: 200,
        },
        {
            field: 'Trạng thái',
            width: 100,
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
                                    setRole(s);
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
