import React, { useState, useRef, useEffect } from 'react';
import { Card, Avatar, Input, Modal, Tabs, Form, Button } from 'antd';
import "./ExchangePage.scss";
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import PostList from './PostList';
import CreatePost from './CreatePost';

import PostListByUser from './PostListByUserId';
import MyProducts from './MyProduct';
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';

const { TabPane } = Tabs;

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
  const [posts, setPosts] = useState(initialPosts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const fileInputRef = useRef(null);
  const form = Form.useForm();
  const { data: productData, isLoading: isLoadingProduct, refetch } = useGetAllProductForExchangeQuery();
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);

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

  const openAddProductModal = () => {
    setIsAddProductModalVisible(true);
  };

  const closeAddProductModal = () => {
    setIsAddProductModalVisible(false);
  };

  const handleEdit = (post) => {
    setProduct(post);
    setEditingPostId(post.id);
    setIsModalVisible(true);
  };

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    onSubmit(updatedPosts);
  };

  return (
    <>
      <CustomHeader />

      <div className="exchange-page" style={{ marginTop: '10rem' }}>
        <Card>
          <div className="input-placeholder" onClick={openModal}>
            <Avatar src="path_to_avatar_image" />
            <Input placeholder="Bạn muốn bán hay trao đổi đồ vật gì đấy?" readOnly />
          </div>
        </Card>
   
        <Modal
          title="Đăng bài"
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
            <PostListByUser />
          </TabPane>
          <TabPane tab="My Product" key="3">
            <MyProducts />
          </TabPane>
        </Tabs>
      </div>

      <CustomFooter />
    </>
  );
};

export default ExchangePage;
