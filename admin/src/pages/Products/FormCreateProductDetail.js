import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { v4 } from 'uuid';
import styles from './Products.module.scss';
import { getall } from '~/ultils/services/categoriesService';
import { getall as getallProce } from '~/ultils/services/proceduresService';
import { create, createdetail,updatedetail, getbyid, update, getdetailbyid } from '~/ultils/services/productService';
import { getCookie } from '~/ultils/cookie';
const cx = classNames.bind(styles);
function FormCreateProductDetail({ onClose, title, onSuccess, id, idDetail = '' }) {
    console.log("xsssssssssss", idDetail)
    const [categories, setCategories] = useState([]);
    const [procedures, setProceDures] = useState([]);
    const [category, setCategory] = useState('');
    const [procedure, setProceDure] = useState('');
    const [titlex, setTitlex] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState('');

    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        const fetchCate = async () => {
            try {
                const response = await getall('', '');
                setCategories(response.result);
            } catch (e) {
                console.log(e);
            }
        };
        const fetchProce = async () => {
            try {
                const response = await getallProce('', '');
                setProceDures(response.result);
            } catch (e) {
                console.log(e);
            }
        };
        fetchCate();
        fetchProce();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await getbyid(id);
                    
                    if(response.statusCode === 200) {
                        setTitlex(response.data.name);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }

        if (idDetail) {
            const fetchData = async () => {
                try {
                    const response = await getdetailbyid(idDetail);
                    
                    if(response.statusCode === 200) {
                        setColor(response.data.color);
                        setSize(response.data.size);
                        setQuantity(response.data.quantity);
                        setPrice(response.data.price);
                        setImage(response.data.image);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }
    }, []);

    function handleColorChange(event) {
        setColor(event.target.value);
    }

    function handleSizeChange(event) {
        setSize(event.target.value);
    }


    function handleQuantityChange(event) {
        setQuantity(event.target.value);
    }

    function handleCategoryChange(event) {
        setCategory(event.target.value);
    }

    function handleProcedureChange(event) {
        setProceDure(event.target.value);
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
        if (!color || !size || !quantity || !price) {  // !image
            alert('Vui lòng nhập đủ thông tin màu sắc, size, số lượng, giá bán');
            return;
        }
        if (id && !idDetail) {
            const data = {
                productId: id,
                size: size,
                color: color,
                price: price,
                quantity: quantity,
                image: image
            };
            const fetchAPI = async () => {
                try {
                    const response = await createdetail(data);
                    console.log(response);
                    onSuccess(response.status);
                } catch (e) {
                    console.log(e);
                }
            };
            window.location.reload();
            fetchAPI();
        }

        if (id && idDetail) {
            const data = {
                id: id,
                productId: id,
                size: size,
                color: color,
                price: price,
                quantity: quantity,
                image: image
            };
            const fetchAPI = async () => {
                try {
                    const response = await updatedetail(data);
                    console.log(response);
                    // onSuccess(response.status);
                } catch (e) {
                    console.log(e);
                }
            };
            fetchAPI();
            // window.location.reload();
        }
        
        onClose();
    }

    const shoeSizes = [
        { size: 36, description: "Small size, suitable for kids or women with small feet" },
        { size: 37, description: "Small size" },
        { size: 38, description: "Small to medium size" },
        { size: 39, description: "Medium size, most common size for women" },
        { size: 40, description: "Medium size, common size for women" },
        { size: 41, description: "Medium size, common size for men" },
        { size: 42, description: "Large size, suitable for men with average feet" },
        { size: 43, description: "Large size, suitable for men with large feet" },
        { size: 44, description: "Large size, often for men" },
        { size: 45, description: "Very large size, suitable for men with very large feet" }
    ];

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="form">
                    <Form.Group controlId="title">
                        <Form.Label>Tên Sản Phẩm</Form.Label>
                        <p>{titlex}</p>
                    </Form.Group>
                    <Form.Group controlId="category">
                        <Form.Label>Màu sắc</Form.Label>
                        <Form.Control type="color" value={color} onChange={handleColorChange} />
                    </Form.Group>
                    <Form.Group controlId="procedure">
                        <Form.Label>Size</Form.Label>
                        <Form.Control as="select" value={size} onChange={handleSizeChange}>
                            <option value="">Chọn Size</option>
                            {shoeSizes.map((size) =>
                                <option key={v4()} value={size.size}>
                                    {size.size}
                                </option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control type="number" value={price} onChange={handlePriceChange} />
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

export default FormCreateProductDetail;
