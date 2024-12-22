import { useEffect, useState } from 'react';
import { Form, Row, Button, Col, FormLabel } from 'react-bootstrap';
import { v4 } from 'uuid';
import { getall } from '~/ultils/services/categoriesService';

function FormFilter({ search }) {
    const [id, setId] = useState('');
    const [time, setTime] = useState('');
    const [fullName, setFullName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [status, setStatus] = useState(''); // Add state for status

    const handelIdChange = (e) => {
        setId(e.target.value);
    };
    const handelTimeChange = (e) => {
        setTime(e.target.value);
    };
    const handleChangeFullName = (e) => {
        setFullName(e.target.value);
    };
    const handleChangeFromDate = (e) => {
        setFromDate(e.target.value);
    };
    const handleChangeToDate = (e) => {
        setToDate(e.target.value);
    };

    const handleStatusChange = (e) => {
        // Handle status change
        setStatus(e.target.value);
    };

    const handelSubmit = (event) => {
        event.preventDefault();
        search(fullName, fromDate, toDate, status);
    };

    const statusList = [
        {
            code: 'PENDING',
            title: 'Chờ',
        },
        {
            code: 'CONFIRMED',
            title: 'Đã xác nhận',
        },
        {
            code: 'PROCESSING',
            title: 'Chuẩn bị',
        },
        {
            code: 'SHIPPED',
            title: 'Đã giao hàng',
        },
        {
            code: 'DELIVERED',
            title: 'Đã nhận hàng',
        },
        {
            code: 'CANCELED',
            title: 'Đã hủy',
        },
    ];

    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="id">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập họ tên..."
                            value={fullName}
                            onChange={handleChangeFullName}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="status">
                        <Form.Label>Trạng thái</Form.Label>
                        <select className="form-control" value={status} onChange={handleStatusChange}>
                            {' '}
                            {/* Add status options */}
                            <option value="">Chọn trạng thái</option>
                            {statusList.map((item) => (
                                <option key={item.code} value={item.code}>
                                    {item.title}
                                </option>
                            ))}
                        </select>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="fromDate">
                        <Form.Label>Từ Ngày</Form.Label>=
                        <DatePicker
                            selected={fromDate}
                            onChange={handleChangeFromDate}
                            dateFormat="dd/MM/yyyy" // Format the date to dd/mm/yyyy
                            placeholderText="dd/mm/yyyy" // Show placeholder with date format
                            className="form-control"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="toDate">
                        <Form.Label>Đến Ngày</Form.Label>
                        <DatePicker
                            selected={toDate}
                            onChange={handleChangeToDate}
                            dateFormat="dd/MM/yyyy" // Format the date to dd/mm/yyyy
                            placeholderText="dd/mm/yyyy" // Show placeholder with date format
                            className="form-control"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={handelSubmit}>
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FormFilter;
