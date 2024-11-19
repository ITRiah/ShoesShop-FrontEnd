import classNames from 'classnames/bind';
import SearchForm from '~/components/SearchForm';

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import styles from './Search.module.scss';
import { useEffect, useState } from 'react';
import { search } from '~/ultils/services/productService';
import Button from '~/components/Button';
import ProductItem from '~/components/ProductItem';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setsearchValue] = useState('');
    const [data, setData] = useState([]);
    const [sort, setSort] = useState(1);
    const [limit, setLimit] = useState([0, 0]);
    const { s } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        setsearchValue(s);
        const fetchData = async () => {
            const resposne = await search(s, limit[0], limit[1], sort);
            if (resposne.status === 'success') {
                setData(resposne.data);
            } else {
                setData([]);
            }
        };
        fetchData();
    }, [s, sort, limit]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <div className={cx('search-box')}>
                    <SearchForm
                        className={cx('input')}
                        value={searchValue}
                        onChange={(e) => {
                            setsearchValue(e.target.value);
                        }}
                    />
                    <Button
                        primary
                        onClick={() => {
                            if (searchValue) {
                                navigate('/search/' + searchValue);
                            }
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </div>
                <div className={cx('filter')}>
                    <div className={cx('filter_item')}>
                        <p>Sắp xếp theo:</p>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                            }}
                        >
                            <option value="1">Giá tăng dần</option>
                            <option value="2">Giá giảm dần</option>
                        </select>
                    </div>
                    <div className={cx('filter_price')}>
                        <div className={cx('filter_item')}>
                            <p>Giá từ:</p>
                            <input
                                onChange={(e) => {
                                    setLimit([e.target.value, limit[1]]);
                                }}
                                value={limit[0]}
                                min="0"
                                step="100000"
                                type="number"
                            />
                        </div>
                        <div className={cx('filter_item')}>
                            <p>đến:</p>
                            <input
                                onChange={(e) => {
                                    setLimit([limit[0], e.target.value]);
                                }}
                                value={limit[1]}
                                step="100000"
                                min="0"
                                type="number"
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                setSort(1);
                                setLimit([0, 0]);
                            }}
                        >
                            Xóa Filter
                        </Button>
                    </div>
                </div>
            </div>
            {s ? (
                <div className={cx('result')}>
                    {data.map((item) => {
                        return <ProductItem key={v4()} props={item} />;
                    })}
                </div>
            ) : (
                <div className={cx('result')}>Nhập từ khóa tìm kiếm</div>
            )}
        </div>
    );
}

export default Search;
