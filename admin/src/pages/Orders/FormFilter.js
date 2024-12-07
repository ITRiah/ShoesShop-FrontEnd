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
    const handelSubmit = (event) => {
        event.preventDefault();
        search(fullName, fromDate, toDate);
    };
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
                    <Form.Group controlId="id">
                        <Form.Label>Từ Ngày</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder=""
                            value={fromDate}
                            onChange={handleChangeFromDate}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="id">
                        <Form.Label>Đến Ngày</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder=""
                            value={toDate}
                            onChange={handleChangeToDate}
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
