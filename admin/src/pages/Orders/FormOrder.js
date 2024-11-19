import { Button, Modal, Table, Form, FormGroup, FormControl } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { getbyid } from '~/ultils/services/OrdersService';
import { v4 } from 'uuid';

function FormOrder({ onClose, id }) {
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getbyid(id);
                setProducts(response.products);
                setOrderData(response.data[0]);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [id]);

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
                            <FormControl disabled value={orderData.fullname} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Địa chỉ:</Form.Label>
                            <FormControl disabled value={orderData.address} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Điện thoại:</Form.Label>
                            <FormControl disabled value={orderData.mobile} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Email:</Form.Label>
                            <FormControl disabled value={orderData.email} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Ghi chú:</Form.Label>
                            <FormControl disabled value={orderData.note} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Trạng thái:</Form.Label>
                            <FormControl
                                disabled
                                value={orderData.payment_status === '0' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                            />
                        </FormGroup>
                        <br />
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Mã sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá sản phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={v4()}>
                                        <td>{product.product_id}</td>
                                        <td>{product.title}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.product_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Form>
                ) : (
                    <p>Loading...</p>
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

export default FormOrder;
