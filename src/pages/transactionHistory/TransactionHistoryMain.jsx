import React, { useEffect, useState } from 'react';
import { Tabs, Table, Spin, message, Tag, Button, Avatar, Image } from 'antd';
import { useGetAllTransactionQuery } from '../../services/userAPI';
import { useGetAllFinishedForUserQuery, useAcceptCompletedExchangeMutation } from '../../services/exchangeAPI';
import dayjs from 'dayjs';
import CartModal from './cartModal';
import { FileSearchOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const TransactionHistory = () => {
    const { data: transactions, isLoading: isLoadingTransactions, refetch: refetchTransactions } = useGetAllTransactionQuery();
    const { data: exchanges, isLoading: isLoadingExchanges, refetch: refetchExchanges } = useGetAllFinishedForUserQuery();
    const [acceptCompletedExchange] = useAcceptCompletedExchangeMutation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        refetchTransactions();
        refetchExchanges();
    }, [refetchTransactions, refetchExchanges]);

    const generateRowKey = (prefix, index) => `${prefix}-${index}`;

    if (isLoadingTransactions || isLoadingExchanges) {
        return <Spin tip="Loading data..." />;
    }

    if (!transactions || !exchanges) {
        message.error('Failed to load data');
        return null;
    }

    const ongoingTransactions = transactions.filter(transaction => !transaction.status);
    const completedTransactions = transactions.filter(transaction => transaction.status);
    const ongoingExchanges = exchanges.filter(exchange => !exchange.isCompleted);
    const completedExchanges = exchanges.filter(exchange => exchange.isCompleted);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleViewDetails = (transaction) => {
        setIsModalVisible(true);
        setSelectedTransaction(transaction);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedTransaction(null);
    };

    const handleAcceptExchange = async (exchangeId) => {
        try {
            await acceptCompletedExchange(exchangeId).unwrap();
            message.success('Exchange accepted successfully');
            refetchExchanges();
        } catch (error) {
            message.error('Failed to accept exchange');
        }
    };

    const handleRateExchange = (exchangeId) => {
        // Handle rate exchange logic here
        message.info('Rate exchange functionality to be implemented.');
    };

    const transactionColumns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice) => `${formatPrice(totalPrice)}`,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'orange'}>
                    {status ? 'Completed' : 'Ongoing'}
                </Tag>
            ),
        },
        {
            title: 'View Details',
            key: 'viewDetails',
            render: (text, record) => (
                <Button type='primary' icon={<FileSearchOutlined />} onClick={() => handleViewDetails(record)}>
                    View Details
                </Button>
            ),
        },
    ];

    const exchangeColumns = [
        {
            title: 'Post',
            dataIndex: 'post',
            key: 'post',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {record.postOwner.imgUrl ? (
                        <Avatar src={record.postOwner.imgUrl} size={'large'} />
                    ) : (
                        <Avatar icon={<UserOutlined />} />
                    )}
                    <div style={{ marginLeft: '10px' }}>
                        <span>{record.postOwner.userName}</span>
                        <br />
                        <a href={`/post/${record.post.id}`}>{record.post.title}</a>
                    </div>
                </div>
            ),
        },
        {
            title: 'Exchange Product',
            dataIndex: 'exchangedProducts',
            key: 'exchangedProducts',
            render: (exchangedProducts) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {exchangedProducts.map(product => (
                        <div key={product.id} style={{ marginRight: '10px' }}>
                            <Image src={product.urlImg} alt={product.name} style={{ width: '50px', height: '50px' }} />
                            <p>{product.name}</p>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: '',
            key: 'actionIcon',
            render: () => (
                <SwapOutlined style={{ fontSize: '24px', margin: '0 10px' }} />
            ),
        },
        {
            title: 'Product of Post',
            dataIndex: 'productOfPost',
            key: 'productOfPost',
            render: (productOfPost) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={productOfPost.urlImg} alt={productOfPost.name} style={{ width: '50px', height: '50px' }} />
                    <p>{productOfPost.name}</p>
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                record.isCompleted ? 
                <Button type="primary" onClick={() => handleRateExchange(record.id)}>Rate</Button> :
                <Button type="primary" onClick={() => handleAcceptExchange(record.id)}>Accept</Button>
            ),
        },
    ];

    return (
        <>
            <Tabs defaultActiveKey="1" style={{ width: "100%", marginTop: '6rem', marginBottom: '1rem' }} >
                <TabPane tab="Ongoing Transactions" key="1">
                    <Table
                        style={{ marginTop: "2rem" }}
                        dataSource={ongoingTransactions}
                        columns={transactionColumns}
                        rowKey={(record, index) => generateRowKey('ongoing-transactions', index)}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Completed Transactions" key="2">
                    <Table
                        style={{ marginTop: "2rem" }}
                        dataSource={completedTransactions}
                        columns={transactionColumns}
                        rowKey={(record, index) => generateRowKey('completed-transactions', index)}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Ongoing Exchanges" key="3">
                    <Table
                        style={{ marginTop: "2rem" }}
                        dataSource={ongoingExchanges}
                        columns={exchangeColumns}
                        rowKey={(record, index) => generateRowKey('ongoing-exchanges', index)}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Completed Exchanges" key="4">
                    <Table
                        style={{ marginTop: "2rem" }}
                        dataSource={completedExchanges}
                        columns={exchangeColumns}
                        rowKey={(record, index) => generateRowKey('completed-exchanges', index)}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
            </Tabs>
            <CartModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                transaction={selectedTransaction}
            />
        </>
    );
};

export default TransactionHistory;
