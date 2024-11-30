import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { v4 } from 'uuid';

import { getall } from '~/ultils/services/categoriesService';
import { create, getbyid, update } from '~/ultils/services/productService';
import { getCookie } from '~/ultils/cookie';

function FormProducts({ onClose, title, onSuccess, id }) {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [titlex, setTitlex] = useState('');
    const [price, setPrice] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchCate = async () => {
            try {
                const response = await getall('', '');
                setCategories(response.result);
            } catch (e) {
                console.log(e);
            }
        };
        fetchCate();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await getbyid(id);
                    
                    if(response.statusCode === 200) {
                        setCategory(response.data.category.id)
                        setTitlex(response.data.name);
                        setStatus(response.data.isDeleted);
                        setPrice(response.data.priceRange);
                        setShortDescription(response.data.description);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }
    }, []);

    function handleCategoryChange(event) {
        setCategory(event.target.value);
    }

    function handleTitleChange(event) {
        setTitlex(event.target.value);
    }

    function handlePriceChange(event) {
        setPrice(event.target.value);
    }

    function handleShortDescriptionChange(event) {
        setShortDescription(event.target.value);
    }

    function handleStatusChange(event) {
        setStatus(event.target.value);
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

    function handleSubmit(event) {
        event.preventDefault();
        if (!category || !titlex || !price) {  // !image
            alert('Vui lòng nhập đủ thông tin sản phẩm, tên sản phẩm, hình ảnh, giá bán');
            return;
        }
        if (id) {
            console.log("id", id)
            const data = {
                id: id,
                category_id: category,
                title: titlex,
                avatar: image,
                price: price,
                summary: shortDescription,
                status: status,
            };
            const fetchAPI = async () => {
                try {
                    const response = await update(data);
                    console.log(response);
                    onSuccess(response.status);
                } catch (e) {
                    console.log(e);
                }
            };
            fetchAPI();
        } else {
            const data = {
                category_id: category,
                title: titlex,
                avatar: image,
                price: price,
                summary: shortDescription,
                status: 1,
            };

            const fetchAPI = async () => {
                try {
                    const response = await create(data);
                    onSuccess(response.status);
                } catch (e) {
                    console.log(e);
                }
            };
            fetchAPI();
        }

        onClose();
    }

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="form">
            

                    <Form.Group controlId="title">
                        <Form.Label>Tên Sản Phẩm</Form.Label>
                        <Form.Control type="text" value={titlex} onChange={handleTitleChange} />
                    </Form.Group>
                    <Form.Group controlId="category">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                            <option value="">Chọn Danh Mục</option>
                            {categories.map((cate) =>
                                <option key={v4()} value={cate.id}>
                                    {cate.name}
                                </option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Trạng Thái</Form.Label>
                        <Form.Control as="select" value={status} onChange={handleStatusChange}>
                            <option value="1">Enable</option>
                            <option value="0">Disable</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="price">
                        <Form.Label>Mức giá</Form.Label>
                        <Form.Control type="number" value={price} onChange={handlePriceChange} />
                    </Form.Group>

                    <Form.Group controlId="shortDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={shortDescription}
                            onChange={handleShortDescriptionChange}
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
                <Button variant="primary" onClick={handleSubmit}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormProducts;
