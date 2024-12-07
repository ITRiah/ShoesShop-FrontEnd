import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import AuthForm from '~/components/AuthForm';
import styles from './Login.module.scss';
import FormInput from '~/components/AuthForm/FormInput';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { forgotPassword, updatePassword } from '~/ultils/services/userService'; // Assuming you have the services
import { getCookie, setCookie } from '~/ultils/cookie';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const startTimer = () => {
        setIsTimerRunning(true);
        const countdown = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(countdown);
                    setIsTimerRunning(false);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const handleSubmitOtpRequest = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!email) {
            setErrorMessage('Vui lòng nhập email');
            return;
        }

        try {
            const response = await forgotPassword({ email });
            console.log(response);
            if (response.statusCode === 201) {
                setIsTimerRunning(true);
                setTimer(60);
                setIsOtpSent(true);
                startTimer(); // Start the timer once OTP is sent
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const handleSubmitPasswordReset = async (e) => {
        e.preventDefault();

        if (!otp || !password) {
            setErrorMessage('Vui lòng nhập đầy đủ OTP và mật khẩu mới');
            return;
        }

        const response = await updatePassword({ email, otp, password });
        console.log(response);
        if (response.statusCode === 201) {
            setIsSuccess(true);
            setTimeout(() => {
                window.location.href = routes.login; // Redirect to login page after success
            }, 2000);
        } else {
            setErrorMessage(response.message);
        }
    };

    return (
        <AuthForm title="Quên mật khẩu" img="https://shopdunk.com/images/uploaded/banner/VNU_M492_08%201.jpeg">
            {isSuccess ? (
                <div>Đổi mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập.</div>
            ) : (
                <>
                    {!isOtpSent ? (
                        <>
                            <div className={cx('wrapper')}>
                                <FormInput value={email} onChange={handleEmailChange} type="email" label="Email" />
                            </div>
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                            <div className={cx('btn')}>
                                <Button onClick={handleSubmitOtpRequest} primary>
                                    Gửi OTP
                                </Button>
                            </div>
                            <div>
                                Bạn nhớ mật khẩu?
                                <Link className={cx('link')} to={routes.login}>
                                    Đăng nhập
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={cx('wrapper')}>
                                <FormInput value={otp} onChange={handleOtpChange} type="text" label="Mã OTP" />
                                <FormInput
                                    value={password}
                                    onChange={handlePasswordChange}
                                    type="password"
                                    label="Mật khẩu mới"
                                />
                            </div>
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                            {isTimerRunning ? (
                                <div>{timer} giây còn lại để nhập OTP</div>
                            ) : (
                                <div>
                                    <Button onClick={handleSubmitOtpRequest} outline>
                                        Lấy OTP mới
                                    </Button>
                                </div>
                            )}
                            <div className={cx('btn')}>
                                <Button onClick={handleSubmitPasswordReset} primary>
                                    Cập nhật mật khẩu
                                </Button>
                            </div>
                        </>
                    )}
                </>
            )}
        </AuthForm>
    );
}

export default ForgotPassword;
