// ProductDetailPage.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Row, Col, Button, Image, Tag } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import './DetailForAll.scss';
import { useGetProductDetailQuery } from '../../services/productAPI';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { data: productData, isLoading, error, refetch } = useGetProductDetailQuery(productId);
    console.log(productData)
    const user = useSelector(selectCurrentUser);
    console.log(user)
    const navigate = useNavigate();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching data</div>;
    }

    if (!productData) {
        return <div>No post details available</div>;
    }

    return (
        <>
            <CustomHeader />

            <div className="product-detail-container" style={{ marginTop: '10rem' }}>
                <Button
                    style={{ margin: '1rem', left: '2rem' }}
                    onClick={() => navigate(-1)}
                    type='primary'
                    icon={<ArrowLeftOutlined />}
                >
                    Back
                </Button>
                <Row justify="center" gutter={24}>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <Card className="product-card">

                            <div className="product-content">


                                <div className="product-image">
                                    <Image src={productData.urlImg} alt={productData.name} />
                                </div>
                                <div className="product-details">
                                    <Card.Meta
                                        title={productData.name}
                                        description={
                                            <>
                                                <p><strong>Price:</strong> ${productData.price}</p>
                                                <p><strong>Category:</strong> {productData.categoryName}</p>
                                                <p><strong>Subcategory:</strong> {productData.subcategoryName}</p>
                                                <p><strong>Location:</strong> {productData.location}</p>
                                                <p><strong>Description:</strong></p>
                                                <p>{productData.description}</p>
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                    {productData.userId != user.id ? (
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Card className="user-card">
                                <div className="user-info">
                                    <Image
                                        src={user.imgUrl}
                                        alt="User Avatar"
                                        className="user-avatar"
                                        preview={false}
                                    />
                                    <div className="user-details">
                                        <h3>{productData.userName}</h3>
                                        <Tag icon={<UserOutlined />} color="default">Seller</Tag>
                                    </div>
                                </div>
                                <Button type="primary" block>Message Seller</Button>
                            </Card>
                        </Col>
                    ) : null}
                </Row>
            </div>
            <CustomFooter />
        </>
    );
};

export default ProductDetailPage;
