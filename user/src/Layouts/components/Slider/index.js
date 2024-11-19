import classNames from 'classnames/bind';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/swiper-bundle.css';
import 'swiper/css/autoplay';

import styles from './Slider.module.scss';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function Slider({ className, props }) {
    return (
        <div className={cx('wrapper', className)}>
            <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                autoplay={{ delay: 300 }}
                loop={true}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
            >
                {props.map((slide) => {
                    return (
                        <SwiperSlide key={v4()}>
                            <img src={slide.image_event} alt={slide.description} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}

export default Slider;
