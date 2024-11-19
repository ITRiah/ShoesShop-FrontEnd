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

const cx = classNames.bind(styles);

function Orders() {
    const [rows, setRows] = useState([]);
    const [id, setId] = useState('');
    const [time, setTime] = useState('');
    const [idShow, setIdShow] = useState('');

    const col = [
        {
            field: 'ID',
            width: 50,
        },
        {
            field: 'Người Nhận',
            width: 120,
        },
        {
            field: 'Địa Chỉ',
            width: 120,
        },
        {
            field: 'Điện Thoại',
            width: 120,
        },
        {
            field: 'Tổng Tiền',
            width: 150,
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
            const response = await getall(id, time);
            if (response.status === 'success') {
                const newData = response.data.map(
                    ({ id, fullname, address, mobile, price_total, payment_status: status }) => {
                        const menu = [
                            {
                                title: 'Chi tiết',
                                onClick: () => {
                                    setIdShow(id);
                                },
                            },
                        ];

                        const formatPrice = new Intl.NumberFormat('vi-VN').format(price_total);
                        return {
                            id,
                            fullname,
                            address,
                            mobile,
                            price_total: formatPrice + 'đ',
                            status:
                                status === '1' ? (
                                    <span className="success">Đã thanh toán</span>
                                ) : (
                                    <span className="error">Chưa thanh toán</span>
                                ),
                            action: <Ellipsis type2 menu={menu} />,
                        };
                    },
                );
                setRows(newData);
            } else {
                setRows([]);
            }
        };
        fetchData();
    }, [time, id]);

    return (
        <div>
            {idShow && (
                <FormOrder
                    id={idShow}
                    onClose={() => {
                        setIdShow('');
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
                            search={(id, t) => {
                                setId(id);
                                setTime(t);
                            }}
                        />
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Orders;
