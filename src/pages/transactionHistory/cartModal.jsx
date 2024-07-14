import React from 'react';
import { Modal, Button, Table, Image, Tag } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
// import './CartModal.scss';

const CartModal = ({ isVisible, onClose, transaction }) => {
  console.log(transaction)

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'productImgUrl',
      key: 'productImgUrl',
      render: (text) => <Image style={{ width: '300px', height: 'auto' }} className="product-image" src={text} />,
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `₫${text.toLocaleString()}`,
    },
  ];

  const handleStatus = {
    true: <Tag color='success'><Button type='text' icon={<CheckCircleOutlined style={{ color: "green" }} />}>Complete</Button></Tag>,
    false: <Tag color='warning'><Button type='text' icon={<LoadingOutlined style={{ color: "gold" }} />}>Ongoing</Button></Tag>
  }

  return (
    <Modal
      width={'50%'}
      title={<p>Transaction Details  <span style={{ marginLeft: '1rem' }}>{handleStatus[transaction?.status]}</span></p>}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" danger onClick={onClose}>
          Close
        </Button>,
      ]}
      className="cart-modal"
    >
      <div style={{ display: 'grid', margin: '2rem 0' }}>
        <p><strong>Order ID:</strong> {transaction?.id}</p>
        <p style={{ margin: '1rem 0' }}><strong>Name:</strong> {transaction?.userName}</p>
        <p><strong>Date:</strong> {new Date(transaction?.date).toLocaleDateString()}</p>

      </div>

      <Table
      
        className="order-table"
        columns={columns}
        dataSource={transaction?.orderDetails}
        rowKey="id"
        pagination={false}
      />
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <div style={{ margin: '2rem 0  2rem 0',fontSize:'15px' }}>

          <p style={{ padding: '20px 0' }}><strong>Amount:</strong> <span style={{ color: '#f05d40' }}>₫{transaction?.amount.toLocaleString()}</span></p>
          <p><strong>Total Price:</strong><span style={{color:'green'}}> ₫{transaction?.totalPrice.toLocaleString()}</span></p>


        </div>
      </div>
    </Modal>
  );
};

export default CartModal;
