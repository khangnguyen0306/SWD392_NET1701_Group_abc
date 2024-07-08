import React, { useEffect, useState } from 'react';
import { Table, Avatar, Button, Image, message, Modal, Badge, Spin, Result } from 'antd';
import { useCancelExchangeFromCustomerMutation, useGetAllExchangeFromCustomerQuery } from '../../services/exchangeAPI';
import { StopOutlined, UserOutlined, SwapOutlined } from '@ant-design/icons';
import "./Activity.scss"
const ExchangeRequest = () => {
    const { data: exchangeRequests, isLoading, error, refetch } = useGetAllExchangeFromCustomerQuery();
    const [cancelExchange, { isLoading: isCancelling }] = useCancelExchangeFromCustomerMutation();

    useEffect(() => {
        refetch();
    }, [refetch]);

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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={record.post.imageUrl} alt={record.post.title} style={{ width: '80px', height: '80px', marginRight: '1rem' }} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            {record.postOwner.imgUrl ? (
                                <Avatar src={record.postOwner.imgUrl} size={'large'} />
                            ) : (
                                <Avatar icon={<UserOutlined />} />
                            )}
                            <p style={{ marginLeft: '1rem', fontSize: '14px' }}>{record.postOwner.userName}</p>
                        </div>
                        <p>{record.post.title}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Exchange Product',
            dataIndex: 'exchangeProduct',
            key: 'exchangeProduct',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center',flexDirection:'column' }}>
                    {record.exchangedProducts.map(product => (
                        <div key={product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px',justifyContent:'start' }}>
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
