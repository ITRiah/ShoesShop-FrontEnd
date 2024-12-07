import classNames from 'classnames/bind';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';

import styles from './Vourchers.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Vourcher from '~/components/Vourcher';
import FormVourcher from './FormVoucher';
import FormFilter from './FormFilter';

import { getall } from '~/ultils/services/voucherService';

const cx = classNames.bind(styles);

function Vourchers() {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [deleted, setDeleted] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [idShow, setIdShow] = useState('');
    const [isCreated, setIsCreated] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getall(fromDate, toDate);
                if (response.statusCode !== 200) {
                    setData([]);
                } else {
                    setData(response.result);
                }
            } catch (error) {
                // Xử lý lỗi khi gọi API
                console.log(error);
            }
        };

        fetchData();
    }, [deleted, isCreated, fromDate, toDate]);

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    return (
        <div>
            {showForm || idShow ? (
                <FormVourcher
                    id={idShow}
                    title="Thêm Vourcher"
                    onSuccess={(e) => {
                        if (e === 'success') {
                            setIdShow('');
                            setIsCreated(v4());
                        }
                    }}
                    onClose={() => {
                        setIdShow('');
                        setShowForm(false);
                    }}
                />
            ) : null}
            <WhiteBG title="Quản Lý Voucher">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setShowForm(true);
                            }}
                            search={(fromDate, toDate) => {
                                setFromDate(fromDate);
                                setToDate(toDate);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((item) => {
                            return (
                                <Vourcher
                                    onUpdate={() => {
                                        setIdShow(item.id);
                                    }}
                                    onEventDeleted={onEventDeleted}
                                    key={v4()}
                                    props={item}
                                />
                            );
                        })}
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Vourchers;
