import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Button, Form, Modal, Image } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import styles from './Procedures.module.scss';
import { create, getbyid, update } from '~/ultils/services/proceduresService';
import { getCookie } from '~/ultils/cookie';

const cx = classNames.bind(styles);

function FormProceDure({ onClose, onSuccess, title, id }) {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(1);
    const [type, setType] = useState('product');

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const response = await getbyid(id);

                if (response.status === 'success') {
                    const data = response.data[0];
                    setName(data.name);
                    setType(data.type);
                    setImage(data.avatar);
                    setDescription(data.des);
                    setStatus(data.status);
                } else {
                    // handle error
                }
            }
        };
        fetchData();
    }, [id]);

    function handleNameChange(event) {
        setName(event.target.value);
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(reader.result);
        };
    }

    function handleDescriptionChange(value) {
        setDescription(value);
    }

    function handleTypeChange(event) {
        setType(event.target.value);
    }
    function handelStatusChange(event) {
        setStatus(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (id) {
            const data = {
                id: id,
                name: name,
                type: type,
                des: description ? description : '',
                avatar: image,
                status: status,
            };
            const updateData = async () => {
                const fetchAPI = await update(data);
                onSuccess(fetchAPI.data.status);
                window.location.reload();
            };
            updateData();
        } else {
            const data = {
                name: name,
                avatar: image,
                des: description,
                type: type,
                status: 1,
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
                        <Form.Label>Tên danh mục</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên danh mục"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formType">
                        <Form.Label>Loại danh mục</Form.Label>
                        <Form.Control as="select" value={type} onChange={handleTypeChange}>
                            <option value="0">Sản phẩm</option>
                            <option value="1">Bài viết</option>
                        </Form.Control>
                    </Form.Group>
                    {id && (
                        <Form.Group controlId="formType">
                            <Form.Label>Trạng Thái</Form.Label>
                            <Form.Control as="select" value={status} onChange={handelStatusChange}>
                                <option value="0">Disable</option>
                                <option value="1">Enable</option>
                            </Form.Control>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        {id && <img className="img-form" src={image} alt={name} />}
                        <Form.Control type="file" onChange={handleImageChange} />
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

export default FormProceDure;
