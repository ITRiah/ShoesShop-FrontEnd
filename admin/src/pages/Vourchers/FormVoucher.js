import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Button, Form, Modal, Image } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import styles from './Vourchers.module.scss';
import { create, getbyid, update } from '~/ultils/services/voucherService';
import { getCookie } from '~/ultils/cookie';

const cx = classNames.bind(styles);

function FormVoucher({ onClose, onSuccess, title, id }) {

    const [code, setCode] = useState('');
    const [value, setValue] = useState('');
    const [quantity, setQuantity] = useState('');
    const [maxMoney, setMaxMoney] = useState('');
    const [expiredTime, setExpiredTime] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const response = await getbyid(id);

                if (response.status === 'success') {
                    const data = response.data[0];
                } else {
                    // handle error
                }
            }
        };
        fetchData();
    }, [id]);

    function handleCodeChange(event) {
        setCode(event.target.value);
    }

    function handleValueChange(event) {
        setValue(event.target.value);
    }

    function handleQuantityChange(event) {
        setQuantity(event.target.value);
    }

    function handleMaxMoneyChange(event) {
        setMaxMoney(event.target.value);
    }

    function handleExpiredTimeChange(event) {
        setExpiredTime(event.target.value);
    }

    function handleDescriptionChange(value) {
        setDescription(value);
    }


    function handleSubmit(event) {
        event.preventDefault();
        if (id) {
            const data = {
                code: code,
                value: value,
                quantity: quantity,
                maxMoney: maxMoney,
                expiredTime: expiredTime,
                description: description
            };
            const updateData = async () => {
                const fetchAPI = await update(data);
                onSuccess(fetchAPI.data.status);
                window.location.reload();
            };
            updateData();
        } else {
            const data = {
                code: code,
                value: value,
                quantity: quantity,
                maxMoney: maxMoney,
                expiredTime: expiredTime,
                description: description
            };
            const postData = async () => {
                try {
                    const fetchAPI = await create(data);
                    onSuccess(fetchAPI.data.status);
                } catch (e) {
                    console.log(e);
                }
            };
            postData();
            window.location.reload();
        }
        onClose();
    }

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="form" onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Mã Vourcher</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập mã vourcher..."
                            value={code}
                            onChange={handleCodeChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Giá trị (%)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập giá trị..."
                            value={value}
                            onChange={handleValueChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập số lượng..."
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Giảm tối đa</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập số tiền giảm tối đa..."
                            value={maxMoney}
                            onChange={handleMaxMoneyChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Hết hạn</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Nhập ngày hết hạn..."
                            value={expiredTime}
                            onChange={handleExpiredTimeChange}
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="formDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <ReactQuill value={description} onChange={handleDescriptionChange} placeholder="Nhập mô tả" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button onClick={handleSubmit} variant="primary" type="submit">
                    {id ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormVoucher;
