import React from 'react';
import { Table, Button, Space } from 'antd';

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
            // sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button onClick={() => onEdit(record)}>Edit</Button>
                    <Button type="primary" onClick={() => onApprove(record.id)}>Approve</Button>
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