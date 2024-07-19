import React, { useState } from 'react';
import { Table, Menu, Popconfirm, Dropdown, Button, message } from 'antd';
import { InfoCircleOutlined, DeleteOutlined, MoreOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDeleteReportStaffMutation, useApproveReportMutation } from '../../../services/postAPI';

const ReportTable = ({ reportData, refetchReports, refetchPosts }) => {
    const [sortedInfo, setSortedInfo] = useState({});
    const [deleteReportStaff] = useDeleteReportStaffMutation();
    const [approveReport] = useApproveReportMutation();

    const handleDelete = async (reportId, postId) => {
        try {
            await deleteReportStaff(reportId).unwrap();
            message.success('Report removed from list successfully');
            refetchReports();
            refetchPosts();
        } catch (error) {
            message.error('Failed to remove report from list');
            refetchReports();
        }
    };

    const handleApprove = async (reportId, postId) => {
        try {
            await approveReport(reportId).unwrap();
            message.success('Report approved successfully');
            refetchReports();
            refetchPosts();
        } catch (error) {
            message.error('Failed to approve report');
            refetchReports();
        }
    };

    const actionsMenu = (record) => (
        <Menu>
            <Menu.Item key="view">
                <Link to={`/postDetail/${record.postId}`}>
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <InfoCircleOutlined style={{ paddingRight: '0.5rem', color: '#EEC900', fontSize: '18px' }} />
                        View post detail
                    </p>
                </Link>
            </Menu.Item>
            {record.status != true ? (
                <Menu.Item key="approve">
                    <Popconfirm
                        title="Are you sure you want to approve this report?"
                        onConfirm={() => handleApprove(record.id, record.postId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleOutlined style={{ paddingRight: '0.5rem', color: '#52c41a', fontSize: '18px' }} />
                            Approve
                        </p>
                    </Popconfirm>
                </Menu.Item>
            ) : null}
            <Menu.Item key="disapprove">
                <Popconfirm
                    title="Are you sure you want to disapprove this report?"
                    onConfirm={() => handleDelete(record.id, record.postId)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <DeleteOutlined style={{ paddingRight: '0.5rem', color: '#EE2C2C', fontSize: '18px' }} />
                        {record.status != false ? "Delete report" : "Disapprove and Delete"}
                    </p>
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
            render: (status) => (status ? <Button type="primary" style={{ backgroundColor: 'green' }}>Active</Button> : <Button danger>Pending</Button>),
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
        <div style={{ flex: 1, overflow: "auto" }}>
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
