import { Button, Modal, Row, Col, Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getbyid } from '~/ultils/services/userService';
import { v4 } from 'uuid';

function FormAccount({ onClose, id }) {
    const [customer, setCustomer] = useState(null);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(id);
            setCustomer(response.data[0]);
            setOrder(response.orders);
        };
        fetchData();
    }, [id]);

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin khách hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {customer && (
                    <Row>
                        <Col md={4}>
                            <Image src={customer.avatar} thumbnail />
                        </Col>
                        <Col md={8}>
                            <p>Username: {customer.username}</p>
                            <p>First Name: {customer.first_name}</p>
                            <p>Last Name: {customer.last_name}</p>
                            <p>Điện thoại: {customer.phone}</p>
                            <p>Email: {customer.email}</p>
                            <p>
                                Trạng thái:
                                {customer.status === '1' ? (
                                    <span className="success">Enable</span>
                                ) : (
                                    <span className="error">Disable</span>
                                )}{' '}
                            </p>
                            {order && (
                                <div>
                                    <p>Số đơn hàng: {order.order_count}</p>
                                    <p>Tổng tiền thanh toán: {order.total_payment}</p>
                                </div>
                            )}
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormAccount;
