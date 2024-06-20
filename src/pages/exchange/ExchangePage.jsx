import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Card, List, Avatar, Select, Tabs, message, Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./ExchangePage.scss";

import PostList from './PostList';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import { useCreatePostMutation } from '../../services/postAPI';
import { useForm } from 'antd/es/form/Form';
import CreatePost from './CreatePost';

const { Option } = Select;
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
  const { data: productData, isLoading: isLoadingProduct, refetch: refetchProductData } = useGetAllProductForExchangeQuery();
  const [createPost] = useCreatePostMutation();


  useEffect(() => {
    if (!isModalVisible) {
      resetForm(); // Reset form when modal is closed
    }
  }, [isModalVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleDescriptionChange = (value) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      description: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target.result;
        setProduct(prev => ({ ...prev, IMG: imgData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransactionTypeChange = (value) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      transactionType_id: value
    }));
  };

  const handleProductSelectChange = (value) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      product_id: value
    }));
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

  // const handleSubmit = async (values) => {
  // let newPosts;
  // if (editingPostId) {
  //   newPosts = posts.map(post =>
  //     post.id === editingPostId ? { ...product, id: editingPostId, Date: post.Date } : post
  //   );
  //   setPosts(newPosts);
  //   onSubmit(newPosts);
  // } else {
  //   const newPost = { ...product, id: posts.length + 1, Date: new Date().toISOString() };
  //   newPosts = [newPost, ...posts];
  //   setPosts(newPosts);
  //   onSubmit(newPost);
  // }

  // // Close the modal after submitting the post
  // setIsModalVisible(false);

  // // Display success message
  // message.success('Đăng bài thành công!');

  // // Set active tab based on the transaction type of the new post
  // if (product.transactionType_id === 'exchange') {
  //   setActiveTab('1');
  // } else if (product.transactionType_id === 'sale') {
  //   setActiveTab('2');
  // } else {
  //   setActiveTab('3');
  // }
  //   console.log(values)
  //   // await createPost(values);
  // };

  const handleEdit = (post) => {
    setProduct(post);
    setEditingPostId(post.id);
    setIsModalVisible(true);
  };

  const openModal = () => {
    resetForm(); // Reset form when opening the modal for a new post
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
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <CreatePost setIsModalVisible={setIsModalVisible} />
        </Modal>

        {/* <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Trao đổi" key="1">
          {renderPostList(exchangePosts)}
        </TabPane>
        <TabPane tab="Bán" key="2">
          {renderPostList(salePosts)}
        </TabPane>
        <TabPane tab="Tra đổi & Bán" key="3">
          {renderPostList(bothPosts)}
        </TabPane>
      </Tabs> */}
        <PostList />


      </div>
      <CustomFooter />
    </>
  );
};

export default ExchangePage;
