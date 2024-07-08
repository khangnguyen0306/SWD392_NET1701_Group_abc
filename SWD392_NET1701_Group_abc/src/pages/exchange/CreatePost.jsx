import React, { useState } from 'react';
import { Form, Input, Select, Button, message, Image } from 'antd';
import ReactQuill from 'react-quill';
import { useCreatePostMutation, useGetAllPostByUserQuery } from '../../services/postAPI';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const CreatePost = ({ setIsModalVisible, productData, refetchProducts }) => {
  const [form] = Form.useForm();
  const [createPost] = useCreatePostMutation();
  const { refetch: refetchPosts } = useGetAllPostByUserQuery();
  const [images, setImages] = useState([]);
  const [folder] = useState(uuidv4());

  const handleSubmit = async (values) => {
    try {
      const { title, description, productId } = values;
      await createPost({
        title,
        description,
        productId,
        imageUrl: images.length > 0 ? images[0] : '',
      }).unwrap();
      message.success('Post created successfully');
      refetchPosts();
      form.resetFields();
      setImages(null);
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to create post');
    }
  };

  const handleImageChange = (value) => {
    setImages(value);
  };

  if (!productData) {
    return <h1>Loading...</h1>;
  }

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
        <Select placeholder="Select a product">
          {productData.map((product) => (
            <Option key={product.id} value={product.id}>
              {product.name}
            </Option>
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
          {images?.map((image, index) => (
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
