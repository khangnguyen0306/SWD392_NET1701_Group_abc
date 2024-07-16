import React, { useEffect, useState } from 'react';
import { Table, Button, message, Layout, Badge, Spin } from 'antd';
import { useGetAppealsQuery, useAcceptAppealMutation } from '../../services/appealAPI';
import './AppealManager.scss';

const { Content } = Layout;

const AppealManager = () => {
  const { data: appealData, isLoading: isLoadingAppeal, refetch: refetchAppealData } = useGetAppealsQuery();
  const [acceptAppeal] = useAcceptAppealMutation();
  const [localAppealData, setLocalAppealData] = useState([]);

  useEffect(() => {
    if (appealData) {
      setLocalAppealData(appealData);
    }
  }, [appealData]);

  const handleAccept = async (id) => {
    try {
      await acceptAppeal(id).unwrap();
      message.success('Appeal accepted successfully');
      setLocalAppealData(localAppealData.map(appeal => 
        appeal.userId === localAppealData.find(a => a.id === id).userId
        ? { ...appeal, status: true }
        : appeal
      ));
    } catch (error) {
      message.error('Failed to accept the appeal');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'Ban Reason',
      dataIndex: 'bannerDescription',
      key: 'bannerDescription',
      className: 'wrap-text',
    },
    {
      title: 'Ban Date',
      dataIndex: 'bannerDate',
      key: 'bannerDate',
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.bannerDate) - new Date(b.bannerDate),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      className: 'wrap-text',
    },
    {
      title: 'Appeal Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          color={status ? 'green' : 'yellow'}
          text={status ? 'Approved' : 'Pending'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleAccept(record.id)}
          disabled={record.status}
        >
          Accept
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Content className="appeal-content">
        {isLoadingAppeal ? (
          <div className="loading-spinner">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={localAppealData}
            columns={columns}
            rowKey={(record) => record.id}
            pagination={{ pageSize: 10 }}
            className="appeal-table"
          />
        )}
      </Content>
    </Layout>
  );
};

export default AppealManager;
