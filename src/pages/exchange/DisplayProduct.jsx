// ProductDetail.js

import React, { useEffect } from 'react';
import { Card, Image, Button, Row, Col, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetPostDetailQuery } from '../../services/postAPI';
import { useNavigate } from 'react-router-dom';
import { useGetProductDetailQuery } from '../../services/productAPI';

const { Title, Paragraph } = Typography;

const ProductDisplay = ({ productId }) => {
    const { data: productDetail, isLoading, error, refetch: refetchProductDetail } = useGetProductDetailQuery(productId);

    useEffect(() => {
        refetchProductDetail();
    }, [productId, refetchProductDetail]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching product detail.</p>;
    }

    return (
        <div style={{ padding: '20px'}}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Image
                        src={productDetail?.urlImg}
                        alt="Product Image"
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Card>
                        <Title level={3}>{productDetail?.name}</Title>
                        <Paragraph><span style={{fontWeight:'bold'}}>Category:</span> {productDetail?.categoryName}</Paragraph>
                        <Paragraph>Price: {productDetail?.price}</Paragraph>
                        <Paragraph>Location: {productDetail?.location}</Paragraph>
                        <Paragraph>Description: {productDetail?.description}</Paragraph>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDisplay;
