import { Button, Form, Input, Select, message, Image } from 'antd';
import React, { useState } from 'react';
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import ReactQuill from 'react-quill';
import { useCreatePostMutation, useGetAllPostQuery } from '../../services/postAPI';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = ({ setIsModalVisible }) => {
  const [form] = Form.useForm();
  const { data: productData, isLoading: isLoadingProduct } = useGetAllProductForExchangeQuery();
  const [createPost] = useCreatePostMutation();
  const { refetch: refetchPosts } = useGetAllPostQuery();
  const [images, setImages] = useState([]);
  const [folder] = useState(uuidv4());

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      await createPost({
        title: values.title,
        description: values.description,
        productId: values.productId,
        imageUrl: images.length > 0 ? images[0] : '',  // Lưu URL của hình ảnh đầu tiên
      }).unwrap();
      message.success('Post created successfully');
      refetchPosts();
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to create post');
    }
  };

  const handleImageChange = (value) => {
    setImages(value);
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
      <Form.Item name="image" label="Image">
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dnnvrqoiu",
            uploadPreset: "estate",
          }}
          folder={`posts/${folder}`}
          setState={handleImageChange}
        />
        <div style={{ marginTop: '10px' }}>
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Uploaded Image ${index + 1}`}
              width={200}
              style={{ marginRight: '10px' }}
            />
          ))}
        </div>
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
