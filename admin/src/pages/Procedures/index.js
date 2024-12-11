import classNames from 'classnames/bind';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';

import styles from './Procedures.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Procedure from '~/components/Procedure';
import FormProceDure from './FormProceDure';
import FormFilter from './FormFilter';

import { getall } from '~/ultils/services/proceduresService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Procedures() {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [deleted, setDeleted] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [idShow, setIdShow] = useState('');
    const [isCreated, setIsCreated] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getall(status, name);
                if (response.statusCode === 200) {
                    setData(response.result);
                } else {
                    setData([]);
                }
            } catch (error) {
                // Xử lý lỗi khi gọi API
                console.log(error);
                toast.error(error.message);
            }
        };

        fetchData();
    }, [deleted, isCreated, status, name]);

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    return (
        <div>
            {showForm || idShow ? (
                <FormProceDure
                    id={idShow}
                    title="Thêm Nhà Cung Cấp"
                    onSuccess={(e) => {
                        if (e === 204 || e === 201) {
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
            <WhiteBG title="Quản Lý Nhà Cung Cấp">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setShowForm(true);
                            }}
                            search={(name, s) => {
                                setName(name);
                                setStatus(s);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((item) => {
                            return (
                                <Procedure
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

export default Procedures;
