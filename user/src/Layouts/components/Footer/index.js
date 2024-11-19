import classNames from 'classnames/bind';

import styles from './Footer.module.scss';
import Logo from '../Logo';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer>
            <div className={cx('wrapper')}>
                <div>
                    <div className={'logo'}>
                        <Logo />
                    </div>
                    <div>
                        <p>Địa chỉ: 16 Ngõ 2 - Phố Nguyên Xá - Phường Minh Khai - Quận Bắc Từ Liêm - Hà Nội</p>
                    </div>
                </div>
                <div className={cx('intro')}>
                    <h3>Hotline: 19008911</h3>
                </div>
                <div className={cx('member')}>
                    <h3>Thông báo</h3>
                    <p>Tuyển dụng</p>
                    <p>Gói bảo hành</p>
                </div>
            </div>
            <div className={cx('copyright')}>ShoesShop ©2024 Created by Nguyen Viet Hai</div>
        </footer>
    );
}

export default Footer;
