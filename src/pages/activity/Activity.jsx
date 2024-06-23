import React, { useState } from 'react';
import { List, Avatar, Card, Button, Image, message, Modal } from 'antd'; // Import Modal from Ant Design
import { format } from 'date-fns';
import "./Activity.scss";
import { useCancelExchangeMutation, useGetAllExchangeFromCustomerQuery } from '../../services/exchangeAPI';
import { StopOutlined } from '@ant-design/icons';

const ActivityList = () => {
    const { data: exchangeRequests, isLoading, error, refetch } = useGetAllExchangeFromCustomerQuery();
    const [cancelExchange, { isLoading: isCancelling }] = useCancelExchangeMutation();

    const handleRefresh = () => {
        refetch();
    };

    const handleCancelExchange = async (exchangeId) => {
        try {
            await cancelExchange(exchangeId);
            message.success('Exchange request cancelled successfully');
            refetch();
        } catch (error) {
            message.error('Failed to cancel exchange request');
        }
    };

    // State to control the visibility of the confirmation modal
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching data</div>;
    }

    return (
        <div className="activity-container" style={{ marginTop: '7rem', width: '100%' }}>
            <div className="activity-header">
                <h1>Exchange Requests</h1>
                <Button type="primary" onClick={handleRefresh} loading={isLoading}>Refresh</Button>
            </div>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={exchangeRequests}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <Card className="custom-card">
                            <List.Item.Meta
                                avatar={<Avatar src={item.user.imgUrl} />}
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3>{item.post.title}</h3>
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<StopOutlined />}
                                            onClick={() => showModal(item.id)} // Show modal on button click
                                            loading={isCancelling}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Cancel Exchange
                                        </Button>
                                    </div>
                                }
                                description={`Posted by ${item.user.userName} on ${format(new Date(item.date), 'MMMM dd, yyyy HH:mm')}`}
                            />
                            <div className="activity-content">
                                <Image src={item.post.imageUrl} alt={item.post.title} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                <div dangerouslySetInnerHTML={{ __html: item.description }} style={{marginLeft:'3rem'}}/>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
            {/* Confirmation Modal */}
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

export default ActivityList;
