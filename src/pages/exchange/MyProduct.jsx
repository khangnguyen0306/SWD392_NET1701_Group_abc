import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Empty, Image, Pagination, Modal, message } from 'antd';
import { useDeleteProductMutation, useGetAllProductForExchangeQuery } from '../../services/productAPI';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, FileFilled, PlusCircleOutlined } from '@ant-design/icons';
import ModalEditProduct from './EditProductModal';

const MyProducts = () => {
    const { data: productData, isLoading: isLoadingProduct, refetch, isError } = useGetAllProductForExchangeQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    // State for edit modal and delete confirmation modal
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (isLoadingProduct) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    // Function to handle opening edit modal
    const handleEditProduct = (id) => {
        setSelectedProductId(id);
        setEditModalVisible(true);
    };

    // Function to handle canceling edit modal
    const handleCancelEdit = () => {
        setEditModalVisible(false);
    };

    // Function to handle opening delete confirmation modal
    const handleDeleteProduct = async (productId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteProduct(productId).unwrap();
                    // const message = "Product deleted successfully !";
                    // message.success(message);
            
                } catch (error) {
                    console.log(error);
                    if (error.originalStatus === 200) {
                        refetch();
                        message.success('Deleted successfully');
                    } else {
                        message.error('Failed to delete the product');
                    }
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // Calculate the products to be displayed on the current page
    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = productData.slice(startIndex, startIndex + pageSize);

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
                <>
                    <Row gutter={16} style={{ marginTop: '3rem' }}>
                        {currentProducts.map(product => (
                            <Col span={8} key={product.id} style={{ marginBottom: '16px' }}>
                                <Card
                                    hoverable
                                    cover={<Image src={product.urlImg} style={{ height: '300px', objectFit: 'cover' }} />}
                                >
                                    <Link to={`/productDetailForAll/${product.id}`}>
                                        <Card.Meta title={product.name} description={`Price: $${product.price}`} />
                                    </Link>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                        <EditOutlined
                                            key="edit"
                                            onClick={(e) => { e.stopPropagation(); handleEditProduct(product.id); }}
                                            style={{ fontSize: '20px', color: '#0066FF', marginRight: '1rem', cursor: 'pointer' }}
                                        />
                                        <DeleteOutlined
                                            key="delete"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
                                            style={{ fontSize: '20px', color: '#EE0000', cursor: 'pointer' }}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={productData.length}
                        onChange={page => setCurrentPage(page)}
                        style={{ marginTop: '2rem', textAlign: 'center' }}
                    />
                </>
            )}
            <ModalEditProduct
                visible={editModalVisible}
                productData={selectedProductId}
                onCancel={handleCancelEdit}
                refetchProductData={refetch}
            />
        </div>
    );
};

export default MyProducts;
