import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import { useEditPostMutation, useGetPostDetailQuery } from '../../services/postAPI';
import UploadWidget from '../../components/uploadWidget/uploadWidget';

const { Option } = Select;

const EditPostModal = ({ visible, onOk, onCancel, post, refetchPostData }) => {
    const [form] = Form.useForm();
    const { data: productData, isLoading: isLoadingProduct } = useGetAllProductForExchangeQuery();
    console.log(productData)
    const { data: postDetail, refetch } = useGetPostDetailQuery(post);
    console.log(postDetail)
    const [editPost, { isLoading: isEditing }] = useEditPostMutation();
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [newImageUrl, setNewImageUrl] = useState([]);

    useEffect(() => {
        if (visible && postDetail) {
            form.setFieldsValue({
                title: postDetail.title,
                description: postDetail.description,
                productId: postDetail.product.id,
            });
            setCurrentImageUrl(postDetail?.imageUrl || '');
        }
    }, [visible, postDetail, form]);

    const handleImageChange = (value) => {
        setNewImageUrl(value); 
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const imageUrlToUpdate = newImageUrl.length > 0 ? newImageUrl[0] : currentImageUrl;

            const { data } = await editPost({
                id: post,
                body: { ...values, imageUrl: imageUrlToUpdate }
            });

            if (data) {
                message.success('Post updated successfully');
                onOk();
                refetch();
                refetchPostData();
            } else {
                message.error('Failed to update post');
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            message.error('Failed to update post');
        }
    };

    const handleCancel = () => {
        form.resetFields(); // Reset form fields when modal is closed
        onCancel();
    };

    return (
        <Modal
            title="Edit Post"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Save"
            cancelText="Cancel"
            confirmLoading={isEditing}
        >
            <Form
                form={form}
                layout="vertical"
                name="edit_post_form"
                initialValues={{
                    title: postDetail?.title,
                    description: postDetail?.description,
                    productId: postDetail?.productId,
                }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please input the title of the post!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description of the post!' }]}
                >
                    <ReactQuill
                        style={{ height: 'fit-content' }}
                        theme="snow"
                        value={form.getFieldValue('description')}
                        onChange={(value) => form.setFieldsValue({ description: value })}
                    />
                </Form.Item>
                <Form.Item
                    style={{ marginTop: '1rem' }}
                    name="productId"
                    label="Select Product"
                    rules={[{ required: true, message: 'Please select a product!' }]}
                >
                    <Select
                        loading={isLoadingProduct}
                        placeholder="Select a product"
                    >
                        {productData?.map(product => (
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
                        folder={postDetail?.imageUrl ? postDetail.imageUrl.split('/')[1] : `posts/${postDetail?.folder}`}
                        setState={handleImageChange}
                    />
                    {newImageUrl.length > 0 ? (
                        <img
                            src={newImageUrl[0]}
                            alt="Uploaded Image"
                            style={{ maxWidth: '100%', marginTop: '10px' }}
                        />
                    ) : currentImageUrl ? (
                        <img
                            src={currentImageUrl}
                            alt="Current Image"
                            style={{ maxWidth: '100%', marginTop: '10px' }}
                        />
                    ) : null}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditPostModal;
