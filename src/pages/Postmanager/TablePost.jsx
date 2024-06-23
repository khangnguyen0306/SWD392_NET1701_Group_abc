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
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
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