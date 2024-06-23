import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Empty, Image } from 'antd'; // Import Empty component from antd
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import { Link } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';

const MyProducts = () => {
    const { data: productData, isLoading: isLoadingProduct, refetch, isError } = useGetAllProductForExchangeQuery();

    useEffect(() => {
        refetch();
    }, [refetch])

    if (isLoadingProduct) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>All Products</h1>
                <Link to={"/addProductForExchange"}>
                    <Button type="primary" style={{ marginLeft: '3rem' }} icon={<PlusCircleOutlined />} size='large'>
                        Add Product
                    </Button>
                </Link>
            </div>
            {productData.length === 0 ? (
                <Empty description="No products available" />
            ) : (
                <Row gutter={16} style={{ marginTop: '3rem' }}>
                    {productData.map(product => (
                        <Col span={8} key={product.id} style={{ marginBottom: '16px' }}>
                            <Link to={`/productDetailForAll/${product.id}`}>
                            <Card
                                hoverable
                                cover={<Image src={product.urlImg} style={{ height: '300px', objectFit: 'cover' }} />} // Set height and objectFit style
                            >
                                <Card.Meta title={product.name} description={`Price: $${product.price}`} />
                            </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default MyProducts;
