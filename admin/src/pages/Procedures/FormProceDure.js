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

                if (response.statusCode === 200) {
                    const data = response.data;
                    setName(data.name);
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
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // Send the file to the API
        fetch('http://localhost:8080/api/v1/uploads', {
            method: 'POST',
            body: formData, // FormData handles the `multipart/form-data` headers automatically
        })
            .then((response) => {
                if (!response.ok) {
                    // Extract error message from response if possible
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Failed to upload image');
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.data) {
                    throw new Error('Unexpected response format');
                }
                setImage(data.data); // Assuming `data.data` contains the image URL
                console.log('Upload successful:', data);
            })
            .catch((error) => {
                console.error('Error uploading image:', error.message);
                alert(`Upload failed: ${error.message}`);
            });
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
                image: image
            };
            const updateData = async () => {
                const fetchAPI = await update(data);
                onSuccess(fetchAPI.data.status);
                // window.location.reload();
            };
            updateData();
        } else {
            const data = {
                name: name,
                image: image
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
            // window.location.reload();
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
                            placeholder="Nhập tên nhà cung cấp"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="image">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} />
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
