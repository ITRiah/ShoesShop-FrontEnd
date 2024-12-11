import classNames from 'classnames/bind';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';

import styles from './Categories.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Category from '~/components/Category';
import FormCate from './FormCate';
import FormFilter from './FormFilter';

import { getall } from '~/ultils/services/categoriesService';

const cx = classNames.bind(styles);

function Categories() {
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
                if (response.status === 'fail') {
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
    }, [deleted, isCreated, status, name]);

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    return (
        <div>
            {showForm || idShow ? (
                <FormCate
                    id={idShow}
                    title="Thêm Danh Mục"
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
            <WhiteBG title="Quản Lý Danh Mục">
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
                                <Category
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

export default Categories;
