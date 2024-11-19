import { useState } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';

function FormFilter({ search }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const handelNameChange = (e) => {
        setName(e.target.value);
    };
    const handelStatusChange = (e) => {
        setStatus(e.target.value);
    };
    const handelSubmit = (event) => {
        event.preventDefault();
        search(name, status);
    };
    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="id">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập username..."
                            value={name}
                            onChange={handelNameChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <br />
            <Row>
                <Form.Group controlId="status">
                    <Form.Label>Trạng Thái</Form.Label>
                    <Form.Control as="select" value={status} onChange={handelStatusChange}>
                        <option value="">All</option>
                        <option value="0">Disable</option>
                        <option value="1">Enable</option>
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
