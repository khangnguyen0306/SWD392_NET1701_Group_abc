import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetAllProductQuery, useGetProductDetailQuery } from '../../services/productAPI';
import CustomFooter from '../../components/Footer/CustomFooter';
import CustomHeader from '../../components/Header/CustomHeader';
import { Button, Col, Image, InputNumber, Layout, Modal, Row, Space, Spin, Tag, message } from 'antd';
import "./ProductDetail.scss"
import { addToCart, loadCartFromLocalStorage, updateCartQuantity } from '../../slices/product.slice';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { selectCurrentToken, selectCurrentUser } from '../../slices/auth.slice';
const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const [buyQuantity, setBuyQuantity] = useState(1);
    const cart = useSelector(state => state.product.cart);
    const { data: ProductDetail, isLoadingProduct } = useGetProductDetailQuery(productId);
    const { data: AllProduct, isLoadingAllProducts } = useGetAllProductQuery();
    const [mainImage, setMainImage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const token = useSelector(selectCurrentToken);
    const userId = useSelector(selectCurrentUser)


    const handleIncreaseQuantity = () => {
        if (buyQuantity < ProductDetail.quantity) {
            setBuyQuantity(buyQuantity + 1);
        } else {
            message.error("Quantity cannot be greater than " + ProductDetail.quantity)
        }
    };

    const handleDecreaseQuantity = () => {
        if (buyQuantity > 1) {
            setBuyQuantity(buyQuantity - 1);
        } else {
            message.error("Quantity cannot be less than 1");
        }
    };

    const handleQuantityChange = (value) => {
        if (value >= 1 && value <= ProductDetail.quantity) {
            setBuyQuantity(value);
        }
    };

    const relatedProducts = AllProduct?.filter(product => product.category === ProductDetail?.category && product.id !== productId).slice(0, 5);

    useEffect(() => {
        dispatch(loadCartFromLocalStorage());
        // if (ProductDetail?.urlImg?.length) {
        setMainImage(ProductDetail?.urlImg);
        // }
    }, [dispatch, ProductDetail]);
    // useEffect(() => {
    //     dispatch(loadCartFromLocalStorage());
    //     if (ProductDetail?.urlImg?.length) {
    //         setMainImage(ProductDetail?.urlImg[0]);
    //     }
    // }, [dispatch, ProductDetail]);

    const handleAddToCart = (product) => {
        const isProductInCart = cart.some(item => item.id === product.id);
        if (isProductInCart) {
            const cartItem = cart.find(item => item.id === product.id);
            const totalQuantity = cartItem.quantity + buyQuantity;
            if (totalQuantity > ProductDetail.quantity) {
                message.error('The total quantity exceeds available stock!');
            } else {
                dispatch(updateCartQuantity({ id: product.id, change: buyQuantity }));
                message.success('Product quantity updated in cart successfully!');
            }
        } else {
            if (buyQuantity > ProductDetail.quantity) {
                message.error('The quantity exceeds available stock!');
            } else {
                // Truyền userID vào action payload khi dispatch
                dispatch(addToCart({ userID: userId.id, newItem: { ...product, quantity: buyQuantity } }));
                message.success('Product added to cart successfully!');
            }
        }
    };


    const handleThumbnailClick = (image) => {
        setMainImage(image);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const getShortDescription = (description) => {
        const words = description?.split(' ');
        if (words?.length <= 10) {
            return description;
        }
        return words?.slice(0, 10).join(' ') + ' buy ...';
    };

    if (isLoadingProduct && isLoadingAllProducts) {
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
        </div>
    }

    return (
        <>
            <CustomHeader />
            <Layout className="productdetail-layout">
                <Row justify={'center'}>
                    <Col md={10} span={24} className='product-image'>
                        <Image src={mainImage} />
                        <Row gutter={[8, 8]} className="thumbnail-row" style={{ marginTop: '1rem' }}>
                            {ProductDetail?.imageURL?.slice(0, 4).map((image, index) => (
                                <Col key={index} span={6}>
                                    <Image
                                        height={"130px"}
                                        width={"150px"}
                                        src={image}
                                        className="thumbnail"
                                        preview={false}
                                        onClick={() => handleThumbnailClick(image)}
                                    />
                                </Col>
                            ))}
                        </Row>
                        {ProductDetail?.urlImg?.length > 4 && (
                            <Button type="link" onClick={showModal} className='view-all-image-btn'>
                                View all images
                            </Button>
                        )}
                    </Col>
                    <Col md={8} span={24}>
                        <div className='product-detail-description'>
                            <p className="productTitle">{ProductDetail?.name}</p>
                            <p className="productQuantity"> <Tag color="success">
                                <b>Stock: </b> <span style={{ color: 'red' }}>{ProductDetail?.stockQuantity}</span></Tag></p>
                            <p className="productCategory">{ProductDetail?.category} | {ProductDetail?.subcategoryName}</p>
                            <p className="productPrice"> ₫ {ProductDetail?.price}</p>
                            <p className="productDescription" dangerouslySetInnerHTML={{ __html: ProductDetail?.description }} />

                            <div className="addToCart-btn">
                                <Space >
                                    <Button onClick={handleDecreaseQuantity}>-</Button>
                                    <InputNumber
                                        style={{ width: '50px' }}
                                        min={1}
                                        max={ProductDetail?.quantity}
                                        value={buyQuantity}
                                        onChange={handleQuantityChange}
                                    />
                                    <Button onClick={handleIncreaseQuantity}>+</Button>
                                </Space>
                                <Button
                                    onClick={() => handleAddToCart(ProductDetail)}
                                    style={{ marginLeft: '3rem', display: 'flex', alignItems: 'center', padding: '20px 20px' }}>
                                    <p style={{ fontSize: '20px', marginRight: '10px' }}><ShoppingCartOutlined /> </p> <p >Add to cart </p>
                                </Button>
                                <Button
                                    type='primary'
                                    // onClick={() => handleAddToCart(ProductDetail)}
                                    style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', padding: '20px 20px' }}>
                                    Buy Now
                                </Button>
                            </div>
                        </div>
                    </Col>

                </Row>
                <div style={{ padding: '3rem 0 0 0' }}>
                    <p style={{ paddingLeft: ' 10rem ' }} className='related-Title'>Related Products</p>
                </div>
                <Row gutter={[16, 16]} justify={'center'}>
                    {relatedProducts?.map(relatedProduct => (
                        <Col key={relatedProduct.id} md={4} sm={8} xs={12}>
                            <Link to={`/productDetail/${relatedProduct.id}`}>
                                <div className="relatedProductItem">
                                    <Image src={relatedProduct.urlImg} preview={false} style={{ maxWidth: '100%', height: '300px' }} />
                                    <div className="content-related-item">
                                        <p className='relatedProductName'>{relatedProduct.name}</p>
                                        <p style={{ color: '#000', paddingBottom: '0.7rem' }}>
                                            {getShortDescription(relatedProduct.description)}
                                        </p>
                                        <p className='relatedProductPrice'>₫ {relatedProduct.price}</p>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>

            </Layout>

            <CustomFooter />
            <Modal title="All Images"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                footer={null}
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}
            >
                <Row gutter={[16, 16]}>
                    {ProductDetail?.imageURL?.map((image, index) => (
                        <Col key={index} span={12}>
                            <Image src={image} />
                        </Col>
                    ))}
                </Row>
            </Modal>
        </>
    )
}

export default ProductDetail