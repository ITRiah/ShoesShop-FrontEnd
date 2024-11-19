import { useEffect, useState } from 'react';
import { Form, Row, Button, Col, FormLabel } from 'react-bootstrap';
import { v4 } from 'uuid';

import { getall } from '~/ultils/services/categoriesService';

function FormFilter({ search }) {
    const [id, setId] = useState('');
    const [time, setTime] = useState('');

    const handelIdChange = (e) => {
        setId(e.target.value);
    };
    const handelTimeChange = (e) => {
        setTime(e.target.value);
    };
    const handelSubmit = (event) => {
        event.preventDefault();
        search(id, time);
    };
    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="id">
                        <Form.Label>Mã Đơn</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập mã đơn hàng..."
                            value={id}
                            onChange={handelIdChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <br />
            <Row>
                <Form.Group controlId="status">
                    <Form.Label>Thời Gian</Form.Label>
                    <Form.Control as="select" value={time} onChange={handelTimeChange}>
                        <option value="">All</option>
                        <option value="1">Hôm nay</option>
                        <option value="2">Tuần này</option>
                        <option value="3">Tháng này</option>
                        <option value="4">Năm này</option>
                    </Form.Control>
                </Form.Group>
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
