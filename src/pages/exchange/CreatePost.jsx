import { Button, Form, Input, Select, message } from 'antd';
import React from 'react';
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import ReactQuill from 'react-quill';
import { useCreatePostMutation, useGetAllPostQuery } from '../../services/postAPI';

const CreatePost = ({ setIsModalVisible }) => {
  const [form] = Form.useForm();
  const { data: productData, isLoading: isLoadingProduct, refetch } = useGetAllProductForExchangeQuery();
  const [createPost] = useCreatePostMutation();
  const { refetch: refetchPosts } = useGetAllPostQuery();
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      await createPost({
        title: values.title,
        description: values.description,
        productId: values.productId,
      }).unwrap();
      message.success('Post created successfully');
      refetchPosts(); 
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to create post');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        title: '',
        description: '',
        productId: null,
      }}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter the title' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter the description' }]}
      >
        <ReactQuill />
      </Form.Item>
      <Form.Item
        name="productId"
        label="Select Product"
        rules={[{ required: true, message: 'Please select a product' }]}
      >
        <Select
          placeholder="Select a product"
          loading={isLoadingProduct}
        >
          {productData && productData.map(product => (
            <Select.Option key={product.id} value={product.id}>
              {product.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Post
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => setIsModalVisible(false)}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreatePost;
