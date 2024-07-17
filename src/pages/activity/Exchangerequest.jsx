import React, { useEffect, useState } from 'react';
import { Table, Avatar, Button, Image, message, Modal, Badge, Spin, Result, Card } from 'antd';
import { useCancelExchangeFromCustomerMutation, useGetAllExchangeFromCustomerQuery } from '../../services/exchangeAPI';
import { StopOutlined, UserOutlined, SwapOutlined } from '@ant-design/icons';
import "./Activity.scss"
import { Link } from 'react-router-dom';
const ExchangeRequest = () => {
    const { data: exchangeRequests, isLoading, error, refetch } = useGetAllExchangeFromCustomerQuery();
    const [cancelExchange, { isLoading: isCancelling }] = useCancelExchangeFromCustomerMutation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exchangeIdToCancel, setExchangeIdToCancel] = useState(null);

    const showModal = (exchangeId) => {
        setExchangeIdToCancel(exchangeId);
        setIsModalVisible(true);
    };



    const handleOk = async () => {
        try {
            await cancelExchange(exchangeIdToCancel);
            message.success('Exchange request cancelled successfully');
            refetch();
        } catch (error) {
            message.error('Failed to cancel exchange request');
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Result
                    status="error"
                    title="Error"
                    subTitle="Sorry, there was an error fetching data."
                />
            </div>
        );
    }

    const columns = [
        {
            title: 'Post',
            dataIndex: 'post',
            key: 'post',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
                    <Link to={`/user-profile/${record.postOwner.id}`}>
                        <div>
                            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {record.postOwner.imgUrl ? (
                                        <Avatar src={record.postOwner.imgUrl} size={'large'} />
                                    ) : (
                                        <Avatar icon={<UserOutlined />} />
                                    )}
                                    <p style={{ marginLeft: '1rem', fontSize: '14px' }}>{record.postOwner?.userName}</p>
                                </div>
                            </Card>
                            <Link to={`/postDetail/${record.post.id}`}>
                                <p style={{ padding: '20px 0' }}>{record.post.title}</p>
                            </Link>
                        </div>
                    </Link>
                </div>
            ),
        },
        {
            title: 'Exchange Product',
            dataIndex: 'exchangeProduct',
            key: 'exchangeProduct',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                    {record.exchangedProducts?.map(product => (
                        <div key={product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'left' }}>
                            <Image src={product.urlImg} alt={product.name} style={{ width: '80px', height: '80px', marginRight: '1rem' }} />
                            <p>{product.name}</p>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: 'action',
            render: (text, record) => (
                <SwapOutlined style={{ fontSize: '24px', margin: '0 10px' }} />
            ),
        },
        {
            title: 'Product of Post',
            dataIndex: 'productOfPost',
            key: 'productOfPost',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={record.productOfPost.urlImg} alt={record.productOfPost.name} style={{ width: '80px', height: '80px', marginRight: '1rem' }} />
                    <p>{record.productOfPost.name}</p>
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="primary"
                    danger
                    icon={<StopOutlined />}
                    onClick={() => showModal(record.id)}
                    loading={isCancelling}
                >
                    Cancel
                </Button>
            ),
        },
    ];

    return (
        <div className="activity-container" style={{ marginTop: '1rem', width: '100%' }}>
            <div className="activity-header">
                <h1>Exchange Requests</h1>
            </div>
            <Table
                columns={columns}
                dataSource={exchangeRequests}
                rowKey="id"
                pagination={false}
            />
            <Modal
                title="Confirm Cancel Exchange"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you sure you want to cancel this exchange request?</p>
            </Modal>
        </div>
    );
};

export default ExchangeRequest;
