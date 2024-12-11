import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import React from 'react';

import styles from './Orders.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Table2 from '~/components/Table2';
import Ellipsis from '~/components/Ellipsis';
import { getall } from '~/ultils/services/OrdersService';
import FormFilter from './FormFilter';
import FormOrder from './FormOrder';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function Orders() {
    const [rows, setRows] = useState([]);
    const [id, setId] = useState('');
    const [time, setTime] = useState('');
    const [idShow, setIdShow] = useState('');
    const [fullName, setFullName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reloadComponent, setReloadComponent] = useState('');

    const col = [
        {
            field: 'ID',
            width: 50,
        },
        {
            field: 'Người Nhận',
            width: 180,
        },
        {
            field: 'Điện Thoại',
            width: 120,
        },
        {
            field: 'Tổng Tiền',
            width: 180,
        },
        {
            field: 'Status',
            width: 137,
        },
        {
            field: 'Action',
            width: 70,
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall(fullName, fromDate, toDate);
            if (response.statusCode === 200) {
                const newData = response.result.map(({ id, fullName, phone, totalAmount, status }) => {
                    const menu = [
                        {
                            title: 'Chi tiết',
                            onClick: () => {
                                setIdShow(id);
                            },
                        },
                    ];

                    const formatPrice = new Intl.NumberFormat('vi-VN').format(totalAmount);
                    return {
                        id,
                        fullName,
                        phone,
                        totalAmount: formatPrice + 'đ',
                        status: status,
                        action: <Ellipsis type2 menu={menu} />,
                    };
                });
                setRows(newData);
            } else {
                setRows([]);
            }
        };
        fetchData();
    }, [fullName, fromDate, toDate, reloadComponent]);

    return (
        <div>
            {idShow && (
                <FormOrder
                    id={idShow}
                    onClose={() => {
                        setIdShow('');
                        setReloadComponent(v4());
                    }}
                />
            )}
            <WhiteBG title="Quản Lý Đơn Hàng">
                <div className={cx('wrapper')}>
                    <div className={cx('table')}>
                        <Table2 rows={rows} colum={col} />
                    </div>
                    <div className={cx('filter')}>
                        <FormFilter
                            search={(fullName, fromDate, toDate) => {
                                setFromDate(fromDate);
                                setToDate(toDate);
                                setFullName(fullName);
                            }}
                        />
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Orders;
