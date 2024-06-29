import React, { useState } from 'react';
import { Table, Tag, Menu, Popconfirm, Dropdown, Button } from 'antd';
import { CloseSquareOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ReportTable = ({ reportData, onDelete }) => {
    const [sortedInfo, setSortedInfo] = useState({});

    const actionsMenu = (record) => (
        <Menu>
            <Menu.Item key="edit">
                <Link to={`/postDetail/${record.id}`}>
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ paddingRight: '0.5rem', color: '#EEC900', fontSize: '18px' }}>
                            <InfoCircleOutlined /></span><span>View post detail</span></p>
                </Link>
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this report?"
                    onConfirm={() => onDelete(record.postId, record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p>
                        <span style={{ paddingRight: '0.5rem', color: '#EE2C2C', fontSize: '18px' }}>
                            <DeleteOutlined /></span>
                        <span>Delete Report</span></p>
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
                    <span style={{ cursor: 'pointer', fontSize: '20px' }}><MoreOutlined /></span>
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
