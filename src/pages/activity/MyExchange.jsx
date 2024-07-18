import React, { useEffect, useState } from 'react';
import { Table, Avatar, Button, Image, message, Modal, Badge, Spin, Result, Card } from 'antd';
import { useAcceptExchangeMutation, useDenyExchangeMutation, useGetAllExchangeFromPosterQuery } from '../../services/exchangeAPI';
import { CheckOutlined, StopOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import "./Activity.scss"
import { Link, useNavigate } from 'react-router-dom';
import signalRService from '../../services/chatAPI';


const MyExchange = () => {
    const { data: myExchanges, isLoading, error, refetch } = useGetAllExchangeFromPosterQuery();
    const [acceptExchange, { isLoading: isAccepting }] = useAcceptExchangeMutation();
    const [denyExchange, { isLoading: isDeny }] = useDenyExchangeMutation();
    const navigate = useNavigate();
    useEffect(() => {
        refetch();
    }, [refetch]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalDenyVisible, setIsModalDenyVisible] = useState(false);
    const [exchangeRecordToAccept, setExchangeRecordToAccept] = useState(null);
    const [loadingAccept, setIsLoadingAccept] = useState(false);
    const [loadingDeny, setIsLoadingDeny] = useState(false);
    const showModal = (record) => {
        console.log(record)
        setExchangeRecordToAccept(record);
        setIsModalVisible(true);
    };
    const showModalDeny = (record) => {
        setExchangeRecordToAccept(record);
        setIsModalDenyVisible(true);
    };
    const handleCreateGroup = async (postId, userId) => {
        const group = {
            postId: postId,
            userExchangeId: userId,
        };
        try {
            await signalRService.createGroup(group);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleOk = async () => {
        try {
            setIsLoadingAccept(true);
            try {
                const rs = await acceptExchange(exchangeRecordToAccept.id);
                if (rs.data) {
                    message.success(rs.data.message + 'You are connected to group chat number:' + exchangeRecordToAccept.post.id);
                    handleCreateGroup(exchangeRecordToAccept.post.id, exchangeRecordToAccept.user.id)
                    navigate('/chat')
                    refetch();
                } else {
                    message.error('Failed to accept exchange request');
                    refetch();
                }
                setIsModalVisible(false);
                setIsLoadingAccept(false)
            } catch (error) {
                message.error('Failed to accept exchange request');
                refetch();
            }
        } catch (error) {
            message.error('Failed to accept exchange request');
        }
    };

    const handleDeny = async () => {
        try {
            setIsLoadingDeny(true)
            try {
                const rs = await denyExchange(exchangeRecordToAccept.id);
                console.log(rs)
                if (rs.data) {
                    message.success(rs.data.message);
                    refetch();
                    setIsModalDenyVisible(false)
                } else {
                    message.error(rs.error.data.message);
                    refetch();
                    setIsModalDenyVisible(false)
                }
            } catch (error) {
                message.error('Failed to Deny exchange request');
                refetch();
            }
            setIsModalVisible(false);
            setIsLoadingDeny(false)
        } catch (error) {
            message.error('Failed to accept exchange request');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleDenyCancel = () => {
        setIsModalDenyVisible(false);
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
                <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', paddingLeft: '1rem' }}>
                    <div>
                        <Link to={`/user-profile/${record?.user.id}`}>
                            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {record.user.imgUrl ? (
                                        <Avatar src={record.user.imgUrl} size={'large'} />
                                    ) : (
                                        <Avatar icon={<UserOutlined />} />
                                    )}
                                    <p style={{ marginLeft: '1rem', fontSize: '14px' }}>{record.user.userName}</p>
                                </div>
                            </Card>
                        </Link>
                        <Link to={`/postDetail/${record.post.id}`}>
                            <p style={{ padding: '20px 0' }}>{record.post.title}</p>
                        </Link>
                    </div>
                    {/* <div>
                        {record.post.imageUrl ? (
                            <Image
                                src={record.post.imageUrl}
                                alt={record.post.title}
                                style={{ width: '80px', height: '80px', marginRight: '1rem' }}
                                preview={false}
                            />
                        ) : null}
                    </div> */}
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
                        <div key={product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'start' }}>
                            <Image src={product.urlImg} alt={product.name} style={{ width: '80px', height: '80px', marginRight: '1rem' }} />
                            <p>{product.name}</p>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: 'swap',
            render: () => (
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
                <>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => showModal(record)}
                        loading={isAccepting}
                        style={{ backgroundColor: '#00CC00', marginRight: '1rem' }}
                    >
                        Accept
                    </Button>
                    <Button
                        type="primary"
                        icon={<StopOutlined />}
                        onClick={() => showModalDeny(record)}
                        loading={isDeny}
                        danger
                    >
                        Deny
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className="activity-container" style={{ marginTop: '1rem', width: '100%' }}>
            <div className="activity-header">
                <h1>My Exchanges</h1>
            </div>
            <Table
                columns={columns}
                dataSource={myExchanges}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title="Confirm Accept Exchange"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={<Button type='primary' loading={loadingAccept}>Yes</Button>}
                cancelText="No"
            >
                <p>Are you sure you want to accept this exchange request?</p>
            </Modal>
            <Modal
                title="Confirm Deny Exchange"
                open={isModalDenyVisible}
                onOk={handleDeny}
                onCancel={handleDenyCancel}
                okText={<Button type='primary' loading={loadingDeny}>Yes</Button>}
                cancelText="No"
            >
                <p>Are you sure you want to Deny this exchange request?</p>
            </Modal>
        </div>
    );
};

export default MyExchange;
