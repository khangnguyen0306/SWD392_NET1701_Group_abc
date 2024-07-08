import React, { useEffect } from 'react';
import { Tabs, Table, Space, Typography, Spin, message, Tag, Button } from 'antd';
import { useGetAllTransactionQuery } from '../../services/userAPI';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Text } = Typography;

const TransactionHistory = () => {
    const { data: transactions, isLoading, refetch } = useGetAllTransactionQuery();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const generateRowKey = (prefix, index) => `${prefix}-${index}`;

    if (isLoading) {
        return <Spin tip="Loading transactions..." />;
    }

    if (!transactions) {
        message.error('Failed to load transactions');
        return null;
    }

    const ongoingTransactions = transactions.filter(transaction => transaction.status);
    const completedTransactions = transactions.filter(transaction => !transaction.status);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const columns = [
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
                <Text type={status ? 'warning' : 'success'}>
                    {status ? <Tag color='orange'>Ongoing</Tag> : <Tag color='green'>Completed</Tag>}
                </Text>
            ),
        },
        {
            title: 'Details',
            dataIndex: 'orderDetails',
            key: 'orderDetails',
            render: (orderDetails) => (
                <Space direction="vertical">
                    {orderDetails.map(detail => (
                        <Text key={detail.id}>Product ID: {detail.productId}, Price: {formatPrice(detail.price)} </Text>
                    ))}
                </Space>
            ),
        },
        {
            title: 'View Details',
            dataIndex: 'View Details',
            key: 'View Details',
            render: () => (
                <Button type='primary'>View Details</Button>
            )
        },
    ];

    return (
        <Tabs defaultActiveKey="1" style={{ width: "100%", marginTop: '6rem', marginBottom: '1rem' }} >
            <TabPane tab="Ongoing Transactions" key="1">
                <Table
                    style={{ marginTop: "2rem" }}
                    dataSource={ongoingTransactions}
                    columns={columns}
                    rowKey={(record, index) => generateRowKey('ongoing', index)}
                    pagination={{ pageSize: 10 }}
                />
            </TabPane>
            <TabPane tab="Completed Transactions" key="2">
                <Table
                    style={{ marginTop: "2rem" }}
                    dataSource={completedTransactions}
                    columns={columns}
                    rowKey={(record, index) => generateRowKey('completed', index)}
                    pagination={{ pageSize: 10 }}
                />
            </TabPane>
        </Tabs>
    );
};

export default TransactionHistory;
