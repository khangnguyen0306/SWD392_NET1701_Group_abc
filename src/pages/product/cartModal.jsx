import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Image, Space, Table, Checkbox, message } from 'antd';
import { loadCartFromLocalStorage, removeFromCart, updateCartQuantity, clearPaidItems } from '../../slices/product.slice';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const CartModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.product.cart);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (visible) {
      dispatch(loadCartFromLocalStorage());
    }
  }, [dispatch, visible]);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleIncreaseQuantity = (itemId) => {
    dispatch(updateCartQuantity({ id: itemId, change: 1 }));
  };

  const handleDecreaseQuantity = (itemId) => {
    dispatch(updateCartQuantity({ id: itemId, change: -1 }));
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allItemIds = cartItems.map(item => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  const totalAmount = selectedItems.reduce((total, itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    return total + (item ? item.price * item.quantity : 0);
  }, 0);

  const columns = [
    {
      title: <Checkbox onChange={(e) => handleSelectAll(e.target.checked)}>Pay All</Checkbox>,
      dataIndex: 'checkbox',
      render: (_, item) => (
        <Checkbox
          checked={selectedItems.includes(item.id)}
          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
        />
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      render: (_, item) => (
        <Space>
          <Image src={item.imageURL} width={50} />
          <div>{item.name}</div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (_, item) => `${item.price} ₫`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, item) => (
        <Space>
          <Button onClick={() => handleDecreaseQuantity(item.id)}>-</Button>
          {item.quantity}
          <Button onClick={() => handleIncreaseQuantity(item.id)}>+</Button>
        </Space>
      ),
    },
    {
      title: 'Money',
      dataIndex: 'money',
      render: (_, item) => `${item.price * item.quantity} ₫`,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, item) => (
        <Button type='primary' danger onClick={() => handleRemoveFromCart(item.id)}>Remove</Button>
      ),
    },
  ];

  const dataSource = cartItems.map(item => ({
    key: item.id,
    ...item,
  }));

  return (
    <Modal
      width={"fit-content"}
      title="Your Cart"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <div style={{ padding: '1rem' }}>Total Amount: {totalAmount.toFixed(2)} ₫</div>
        {totalAmount > 0 ? (
          <PayPalScriptProvider options={{ "client-id":"AZJbL2P3zXWiJVR6L9VSCruzggReYNwEQDtMpJCZYQfp3QWNgwacrqPzraLRL1zgP9x_KnJQ3-ruBri9"}}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: (totalAmount / 23000).toFixed(2), // Convert VND to USD
                      currency_code: 'USD'
                    },
                  }],
                });
              }}
              onApprove={(data, actions) => {
                console.log(data);
                return actions.order.capture().then((details) => {
                  message.success('Transaction completed by ' + details.payer.name.given_name);
                  dispatch(clearPaidItems(selectedItems));
                  onClose();
                });
              }}
            />  
          </PayPalScriptProvider>
        ) : (
          <Button type="primary" disabled>Buy Product</Button>
        )}
      </div>
    </Modal>
  );
};

export default CartModal;
