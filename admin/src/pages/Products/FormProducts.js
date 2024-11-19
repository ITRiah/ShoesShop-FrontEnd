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
    const [color, setColor] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [ram, setRam] = useState('');
    const [storage, setStorage] = useState('');
    const [screenTechnology, setScreenTechnology] = useState('');
    const [resolution, setResolution] = useState('');
    const [refreshRate, setRefreshRate] = useState('');
    const [material, setMaterial] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchCate = async () => {
            try {
                const response = await getall('', '');
                setCategories(response.data);
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
                    const data = response.data[0];
                    setCategory(data.category_id);
                    setTitlex(data.title);
                    setColor(data.color);
                    setPrice(data.price);
                    setQuantity(data.amount);
                    setShortDescription(data.summary);
                    setImage(data.avatar);
                    setStatus(data.status);
                    const other = data.content;
                    setContent(data.content);
                    const data_other = other.split('*||*');
                    setRam(data_other[0]);
                    setStorage(data_other[1]);
                    setScreenTechnology(data_other[2]);
                    setResolution(data_other[3]);
                    setRefreshRate(data_other[4]);
                    setMaterial(data_other[5]);
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }
    }, []);

    useEffect(() => {
        const wall = '*||*';
        setContent(
            ram + wall + storage + wall + screenTechnology + wall + resolution + wall + refreshRate + wall + material,
        );
    }, [ram, storage, screenTechnology, resolution, refreshRate, material]);

    function handleCategoryChange(event) {
        setCategory(event.target.value);
    }

    function handleTitleChange(event) {
        setTitlex(event.target.value);
    }

    function handleColorChange(event) {
        setColor(event.target.value);
    }

    function handlePriceChange(event) {
        setPrice(event.target.value);
    }

    function handleQuantityChange(event) {
        setQuantity(event.target.value);
    }

    function handleShortDescriptionChange(event) {
        setShortDescription(event.target.value);
    }

    function handleRamChange(event) {
        setRam(event.target.value);
    }

    function handleStorageChange(event) {
        setStorage(event.target.value);
    }

    function handleScreenTechnologyChange(event) {
        setScreenTechnology(event.target.value);
    }

    function handleResolutionChange(event) {
        setResolution(event.target.value);
    }

    function handleRefreshRateChange(event) {
        setRefreshRate(event.target.value);
    }

    function handleMaterialChange(event) {
        setMaterial(event.target.value);
    }

    function handleStatusChange(event) {
        setStatus(event.target.value);
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
        };
        reader.readAsDataURL(file);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!category || !titlex || !image || !price || !quantity) {
            alert('Vui lòng nhập đủ thông tin danh mục, tên sản phẩm, hình ảnh, giá bán, số lượng');
            return;
        }
        if (id) {
            const data = {
                id: id,
                category_id: category,
                title: titlex,
                avatar: image,
                color: color,
                price: price,
                amount: quantity,
                summary: shortDescription,
                content: content,
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
                admin_id: getCookie('login').id,
                category_id: category,
                title: titlex,
                avatar: image,
                color: color,
                price: price,
                amount: quantity,
                summary: shortDescription,
                content: content,
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
                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                            <option value="">Chọn Danh Mục</option>
                            {categories.map((cate) =>
                                cate.type === '0' ? (
                                    <option key={v4()} value={cate.id}>
                                        {cate.name}
                                    </option>
                                ) : null,
                            )}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="title">
                        <Form.Label>Tên Sản Phẩm</Form.Label>
                        <Form.Control type="text" value={titlex} onChange={handleTitleChange} />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Trạng Thái</Form.Label>
                        <Form.Control as="select" value={status} onChange={handleStatusChange}>
                            <option value="1">Enable</option>
                            <option value="0">Disable</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="color">
                        <Form.Label>Màu sắc (Mã màu)</Form.Label>
                        <Form.Control type="color" value={color} onChange={handleColorChange} />
                    </Form.Group>

                    <Form.Group controlId="price">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control type="number" value={price} onChange={handlePriceChange} />
                    </Form.Group>

                    <Form.Group controlId="quantity">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
                    </Form.Group>

                    <Form.Group controlId="shortDescription">
                        <Form.Label>Mô tả ngắn</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={shortDescription}
                            onChange={handleShortDescriptionChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="ram">
                        <Form.Label>Dung lượng RAM</Form.Label>
                        <Form.Control type="text" value={ram} onChange={handleRamChange} />
                    </Form.Group>

                    <Form.Group controlId="storage">
                        <Form.Label>Dung lượng ROM</Form.Label>
                        <Form.Control type="text" value={storage} onChange={handleStorageChange} />
                    </Form.Group>

                    <Form.Group controlId="screenTechnology">
                        <Form.Label>Công Nghệ Màn Hình</Form.Label>
                        <Form.Control type="text" value={screenTechnology} onChange={handleScreenTechnologyChange} />
                    </Form.Group>

                    <Form.Group controlId="resolution">
                        <Form.Label>Độ Phân Giải</Form.Label>
                        <Form.Control type="text" value={resolution} onChange={handleResolutionChange} />
                    </Form.Group>

                    <Form.Group controlId="refreshRate">
                        <Form.Label>Tần Số Quét</Form.Label>
                        <Form.Control type="text" value={refreshRate} onChange={handleRefreshRateChange} />
                    </Form.Group>

                    <Form.Group controlId="material">
                        <Form.Label>Chất Liệu</Form.Label>
                        <Form.Control type="text" value={material} onChange={handleMaterialChange} />
                    </Form.Group>
                    <Form.Group controlId="image">
                        <Form.Label>Image</Form.Label>
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
