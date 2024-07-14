import React, { useState, useRef, useEffect } from 'react';
import { Card, Avatar, Input, Modal, Tabs, Form, Button, Space, Typography, Layout } from 'antd';
import "./ExchangePage.scss";
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import PostList from './PostList';
import CreatePost from './CreatePost';
import PostListByUser from './PostListByUserId';
import MyProducts from './MyProduct';
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import { useNavigate } from 'react-router-dom';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const ExchangePage = ({ onSubmit, initialPosts = [] }) => {
  const [product, setProduct] = useState({
    user_id: '',
    transactionType_id: '',
    product_id: '',
    title: '',
    description: '',
    IMG: '',
    Price: '',
    exchangeItem: '',
    userAvatar: 'path_to_avatar_image',
    userName: 'User Name',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const { data: productData, isLoading: isLoadingProduct, refetch } = useGetAllProductForExchangeQuery();
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const openModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setProduct({
      user_id: '',
      transactionType_id: '',
      product_id: '',
      title: '',
      description: '',
      IMG: '',
      Price: '',
      exchangeItem: '',
      userAvatar: 'path_to_avatar_image',
      userName: 'User Name',
    });
    setEditingPostId(null);
  };

  // const openAddProductModal = () => {
  //   setIsAddProductModalVisible(true);
  // };

  // const closeAddProductModal = () => {
  //   setIsAddProductModalVisible(false);
  // };

  // const handleEdit = (post) => {
  //   setProduct(post);
  //   setEditingPostId(post.id);
  //   setIsModalVisible(true);
  // };

  // const handleDelete = (postId) => {
  //   const updatedPosts = posts.filter(post => post.id !== postId);
  //   setPosts(updatedPosts);
  //   onSubmit(updatedPosts);
  // };

  return (
    <>
      <CustomHeader />

      <div className="exchange-page" style={{ marginTop: '10rem',minHeight:'80vh'}}>
        {user ? (
          <Card>
            <div className="input-placeholder" onClick={openModal}>
              <Avatar src="path_to_avatar_image" />
              <Input placeholder="Hello!! What you want to exchange ?" readOnly />
            </div>
          </Card>
        ) : null}

        <Modal
          title="Create post"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <CreatePost
            setIsModalVisible={setIsModalVisible}
            productData={productData}
          />
        </Modal>


        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="All post" key="1">
            <PostList />
          </TabPane>
          <TabPane tab="My post" key="2">
            {user ? (
              <PostListByUser />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="large" align="center">
                  <Title level={4}>Login Required</Title>
                  <p style={{ fontSize: '3rem' }}><UserOutlined /></p>
                  <Text type="secondary">
                    You need to login to see your products.
                  </Text>

                  <Button
                    type="primary"
                    icon={<LoginOutlined />}
                    size="large"
                    onClick={() => navigate('/login', { state: { from: '/exchange' } })}
                  >
                    Login to see your products
                  </Button>
                </Space>
              </div>
            )}
          </TabPane>
          <TabPane tab="My Product" key="3">
            {user ? (
              <MyProducts />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="large" align="center">
                  <Title level={4}>Login Required</Title>
                  <p style={{ fontSize: '3rem' }}><UserOutlined /></p>
                  <Text type="secondary">
                    You need to login to see your products.
                  </Text>

                  <Button
                    type="primary"
                    icon={<LoginOutlined />}
                    size="large"
                    onClick={() => navigate('/login', { state: { from: '/exchange' } })}
                  >
                    Login to see your products
                  </Button>
                </Space>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>

      <CustomFooter />
    </>
  );
};

export default ExchangePage;
