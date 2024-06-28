import React, { useState } from 'react';
import { Table, Tag, Menu, Popconfirm, Dropdown, Button } from 'antd';
import { CloseSquareOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';

const ReportTable = ({ reportData, onEdit }) => {
    const [sortedInfo, setSortedInfo] = useState({});

    const actionsMenu = (record) => (
        <Menu>
            <Menu.Item key="edit" onClick={() => onEdit(record)}>
                <EditOutlined /><span>Edit Report</span>
            </Menu.Item>
            <Menu.Item key="de-ActiveReport">
                <CloseSquareOutlined /><span>De-activate Report</span>
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this report?"
                    // onConfirm={() => handleDeleteReport(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined /><span>Delete Report</span>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a.userId - b.userId,
            sortOrder: sortedInfo.columnKey === 'userId' && sortedInfo.order,
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a, b) => a.userName.localeCompare(b.userName),
            sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
        },
        {
            title: 'Post ID',
            dataIndex: 'postId',
            key: 'postId',
            sorter: (a, b) => a.postId - b.postId,
            sortOrder: sortedInfo.columnKey === 'postId' && sortedInfo.order,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description) => <div dangerouslySetInnerHTML={{ __html: description }} />,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status - b.status,
            sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
            render: (status) => (status ? <Button type="primary" style={{ backgroundColor: 'green' }}>Active</Button> : <Button danger>Draft</Button>),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Dropdown placement="bottomRight" trigger={['click']} overlay={() => actionsMenu(record)}>
                    <span style={{ cursor: 'pointer' }}><MoreOutlined /></span>
                </Dropdown>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    return (
        <div
            style={{
                flex: 1,
                overflow: "auto",
            }}
        >
            <Table
                dataSource={reportData}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
                pagination={{
                    className: 'pagination',
                    pageSize: 10,
                }}
            />
        </div>
    );
};

export default ReportTable;
