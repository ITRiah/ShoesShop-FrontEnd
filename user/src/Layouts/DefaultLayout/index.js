import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './DefaultLayout.module.scss';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Slider from '../components/Slider';
import { getall } from '~/ultils/services/eventsService';

const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    const [slide, setSlide] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const response = await getall(id);
                if (response.status === 'success') {
                    setSlide(response.data);
                } else {
                    setSlide([]);
                }
            } else {
                const response = await getall('');
                if (response.status === 'success') {
                    setSlide(response.data.slice(0, 7));
                } else {
                    setSlide([]);
                }
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('slider')}></div>
            {slide.length > 0 ? <Slider props={slide} /> : null}

            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
