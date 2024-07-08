import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Image, Space, Table, Checkbox, message, Spin } from 'antd';
import { loadCartFromLocalStorage, removeFromCart, updateCartQuantity, clearPaidItems } from '../../slices/product.slice';
import { selectCurrentToken, selectCurrentUser } from '../../slices/auth.slice';
import { Link, useLocation } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCreateCategoryMutation, useCreatePaymentMutation } from '../../services/productAPI';


const CartModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.product.cart);
  const [selectedItems, setSelectedItems] = useState([]);
  const token = useSelector(selectCurrentToken);
  const currentUser = useSelector(selectCurrentUser);
  const [isLoadingPaypal, setIsLoadingPaypal] = useState(true);
  const location = useLocation();
  const [payment] = useCreatePaymentMutation();

  useEffect(() => {
    if (visible && currentUser) {
      dispatch(loadCartFromLocalStorage({ userID: currentUser.id }));
    }
  }, [dispatch, visible, currentUser]);

  const handleRemoveFromCart = (itemId) => {
    if (currentUser) {
      dispatch(removeFromCart({ userID: currentUser.id, itemId }));
    }
  };

  const handleIncreaseQuantity = (itemId) => {
    if (currentUser) {
      dispatch(updateCartQuantity({ userID: currentUser.id, id: itemId, change: 1 }));
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    if (currentUser) {
      dispatch(updateCartQuantity({ userID: currentUser.id, id: itemId, change: -1 }));
    }
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

  const createOrderDetails = () => {
    return selectedItems.map(itemId => {
      const item = cartItems.find(item => item.id === itemId);
      return {
        productId: item.id,
        price: item.price
      };
    });
  };

  const handlePayment = async (tokenId, PayerID) => {
    if (!token) {
      message.error('Please login to make a payment.');
      return;
    }
    try {
      const orderDetails = createOrderDetails();
      const totalPrice = totalAmount;
      const payload = { orderDetails, totalPrice, tokenId, PayerID };
      await payment(payload).unwrap();
    } catch (e) {
      if (e.originalStatus === 200) {
        message.success('Payment completed successfully.');
        dispatch(clearPaidItems({ userID: currentUser.id, itemIds: selectedItems }));
        onClose();
      } else {
        message.error('Payment failed. Please try again.');
      }


    }
  }

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
          <Image src={item.urlImg} width={50} />
          <div>{truncateName(item.name, 20)}</div>
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
          {/* <Button onClick={() => handleDecreaseQuantity(item.id)}>-</Button> */}
          1
          {/* <Button onClick={() => handleIncreaseQuantity(item.id)}>+</Button> */}
        </Space>
      ),
    },
    {
      title: 'Money',
      dataIndex: 'money',
      render: (_, item) => `${item.price} ₫`,
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
    key: item?.id,
    ...item,
  }));
  const truncateName = (name, maxChars) => {
    if (name.length > maxChars) {
      return name.slice(0, maxChars) + '...';
    }
    return name;
  };

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
          token ? (
            <PayPalScriptProvider options={{ "client-id": "AXPhuLgh67BUl4HScRLeU8ymduMbIPPK9LngTXT1YVqpWAloWQfMSNEQAOypkP4aHjyx9g4kQ9Jqwoxi" }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: (totalAmount / 23000).toFixed(2),
                        currency_code: 'USD'
                      },
                    }],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    console.log(details)
                    const PayerID = details.payer.payer_id;
                    const tokenId = details.id;
                    console.log(PayerID, tokenId)
                    handlePayment(tokenId, PayerID);
                  });
                }}
                onInit={() => setIsLoadingPaypal(false)}
              />
              {isLoadingPaypal && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin tip="Loading PayPal..." /></div>}
            </PayPalScriptProvider>
          ) : (
            <div className="check-login-payment" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p style={{ marginRight: '2rem' }}>Please login to buy product</p>
              <Link to={"/login"} state={{ from: location }}>
                <Button type="primary">Login</Button>
              </Link>
            </div>
          )
        ) : (
          <Button type="primary" disabled>Buy Product</Button>
        )}
      </div>
    </Modal>
  );
};

export default CartModal;
