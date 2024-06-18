import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Card, List, Avatar, Select, Tabs, message, Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./ExchangePage.scss";

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

  const handleSubmit = () => {
    let newPosts;
    if (editingPostId) {
      newPosts = posts.map(post => 
        post.id === editingPostId ? { ...product, id: editingPostId, Date: post.Date } : post
      );
      setPosts(newPosts);
      onSubmit(newPosts);
    } else {
      const newPost = { ...product, id: posts.length + 1, Date: new Date().toISOString() };
      newPosts = [newPost, ...posts];
      setPosts(newPosts);
      onSubmit(newPost);
    }

    // Close the modal after submitting the post
    setIsModalVisible(false);

    // Display success message
    message.success('Đăng bài thành công!');

    // Set active tab based on the transaction type of the new post
    if (product.transactionType_id === 'exchange') {
      setActiveTab('1');
    } else if (product.transactionType_id === 'sale') {
      setActiveTab('2');
    } else {
      setActiveTab('3');
    }
  };

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

  const renderPostForm = () => (
    <Form layout="vertical" onFinish={handleSubmit} className="expanded-form">
      <Form.Item label="Tiêu đề" required>
        <Input name="title" value={product.title} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Mô tả" required>
        <ReactQuill value={product.description} onChange={handleDescriptionChange} />
      </Form.Item>
      <Form.Item label="Chọn sản phẩm" required>
        <Select
          placeholder="Chọn sản phẩm"
          onChange={handleProductSelectChange}
          value={product.product_id}
        >
          <Option value="1">Sản phẩm 1</Option>
          <Option value="2">Sản phẩm 2</Option>
          <Option value="3">Sản phẩm 3</Option>
          <Option value="4">Sản phẩm 4</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Chọn hình thức" required>
        <Select
          placeholder="Chọn hình thức"
          onChange={handleTransactionTypeChange}
          value={product.transactionType_id}
        >
          <Option value="exchange">Trao đổi</Option>
          <Option value="sale">Mua bán</Option>
          <Option value="both">Cả hai</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Hình ảnh" required>
        <div>
          <input
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <Button onClick={() => fileInputRef.current.click()}>Chọn ảnh</Button>
          {product.IMG && (
            <img
              src={product.IMG}
              alt="Product"
              style={{ maxWidth: '100px', marginTop: '10px' }}
            />
          )}
        </div>
      </Form.Item>
      {(product.transactionType_id === 'sale' || product.transactionType_id === 'both') && (
        <Form.Item label="Giá" required>
          <Input name="Price" value={product.Price} onChange={handleChange} />
        </Form.Item>
      )}
      {(product.transactionType_id === 'exchange' || product.transactionType_id === 'both') && (
        <Form.Item label="Món hàng muốn trao đổi" required>
          <Input name="exchangeItem" value={product.exchangeItem} onChange={handleChange} />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">{editingPostId ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}</Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => setIsModalVisible(false)}>Hủy</Button>
      </Form.Item>
    </Form>
  );

  const renderPostList = (posts) => (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={posts}
      renderItem={post => (
        <List.Item key={post.id}>
          <List.Item.Meta
            avatar={<Avatar src={post.userAvatar} />}
            title={<span>{post.userName}</span>}
            description={<span>{new Date(post.Date).toLocaleString()}</span>}
          />
          <Card style={{ width: '100%' }}>
            <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
            {post.IMG && <img src={post.IMG} alt={post.title} style={{ maxWidth: '200px' }} />}
            {(post.transactionType_id === 'sale' || post.transactionType_id === 'both') && (
              <p>Giá: {post.Price}</p>
            )}
            {(post.transactionType_id === 'exchange' || post.transactionType_id === 'both') && (
              <p>Món hàng muốn trao đổi: {post.exchangeItem}</p>
            )}
            <div className="button-group">
              <Button className="edit-btn" onClick={() => handleEdit(post)} style={{ marginRight: '10px' }}>Chỉnh sửa</Button>
              <Button className="delete-btn" onClick={() => handleDelete(post.id)} danger>Xóa</Button>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  const exchangePosts = posts.filter(post => post.transactionType_id === 'exchange');
  const salePosts = posts.filter(post => post.transactionType_id === 'sale');
  const bothPosts = posts.filter(post => post.transactionType_id === 'both');

  return (
    <div className="exchange-page">
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
        {renderPostForm()}
      </Modal>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Trao đổi" key="1">
          {renderPostList(exchangePosts)}
        </TabPane>
        <TabPane tab="Bán" key="2">
          {renderPostList(salePosts)}
        </TabPane>
        <TabPane tab="Tra đổi & Bán" key="3">
          {renderPostList(bothPosts)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ExchangePage;
