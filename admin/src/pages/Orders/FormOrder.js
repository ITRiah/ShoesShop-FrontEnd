import { Button, Modal, Table, Form, FormGroup, FormControl } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { getbyid, update } from '~/ultils/services/OrdersService';
import { v4 } from 'uuid';

function FormOrder({ onClose, id }) {
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getbyid(id);
                setOrderData(response.data);
                setStatus(response.data.status);
                setProducts(response.data.orderDetails);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [id]);

    function handleChangeStatus(e) {
        setStatus(e.target.value);
    }

    const statusOptions = [
        { status: 'CANCELED' },
        { status: 'CONFIRMED' },
        { status: 'DELIVERED' },
        { status: 'PENDING' },
        { status: 'PROCESSING' },
        { status: 'SHIPPED' },
    ];

    function onUpdateOrder(event) {
        event.preventDefault();
        if (id) {
            const data = {
                id: id,
                status: status,
            };
            const updateData = async () => {
                const fetchAPI = await update(data);
                window.location.reload();
            };
            updateData();
        }
    }

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chi Tiết Đơn Hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {orderData ? (
                    <Form>
                        <FormGroup>
                            <Form.Label>Mã đơn:</Form.Label>
                            <FormControl disabled value={orderData.id} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Người nhận:</Form.Label>
                            <FormControl disabled value={orderData.fullName} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Địa chỉ:</Form.Label>
                            <FormControl disabled value={orderData.shippingAddress} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Điện thoại:</Form.Label>
                            <FormControl disabled value={orderData.phone} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Ghi chú:</Form.Label>
                            <FormControl disabled value={orderData.note} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Phương thức thanh toán: </Form.Label>
                            <FormControl disabled value={orderData.paymentMethod} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Phương thức vận chuyển: </Form.Label>
                            <FormControl disabled value={orderData.shippingMethod} />
                        </FormGroup>

                        <Form.Group controlId="status">
                            <Form.Label>Trạng thái: </Form.Label>
                            <Form.Control as="select" value={status} onChange={handleChangeStatus}>
                                {statusOptions.map((s) => (
                                    <option key={v4()} value={s.status}>
                                        {s.status}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <br />
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>Số lượng</th>
                                    <th>Giá sản phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item, index) => {
                                    console.log('Product', item);
                                    return (
                                        <tr key={v4()}>
                                            <td>{item.id}</td>
                                            <td>{item.productDetail.color}</td>
                                            <td>{item.productDetail.size}</td>
                                            <td>{item.productDetail.quantity}</td>
                                            <td
                                                style={{
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(item.productDetail.price)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <FormGroup>
                            <Form.Label
                                style={{
                                    textAlign: 'right',
                                }}
                            >
                                Tổng tiền:{' '}
                            </Form.Label>
                            <FormControl
                                style={{
                                    textAlign: 'right',
                                }}
                                disabled
                                value={new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(orderData.totalAmount)}
                            />
                        </FormGroup>
                    </Form>
                ) : (
                    <p>Loading...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={onUpdateOrder}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormOrder;
