import React from 'react';
import { Table, Button, Space } from 'antd';
import { Link } from 'react-router-dom';

const TablePost = ({ postData, onEdit, onApprove }) => {
    const columns = [
        {
            title: 'Post ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Created By',
            dataIndex: 'user',
            render: (user) => <p>{user.userName}</p>,
            key: 'createdBy',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button onClick={() => onEdit(record)}>Edit</Button>
                    <Button type="primary" onClick={() => onApprove(record.id)}>Approve</Button>
                    <Link to={`/postDetail/${record.id}`}>
                        <Button type="primary" style={{ color: '#fff', backgroundColor: '#1890ff', borderColor: '#1890ff' }}>View</Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={postData}
            columns={columns}
            rowKey="id"
            pagination={false}
        />
    );
};

export default TablePost;
