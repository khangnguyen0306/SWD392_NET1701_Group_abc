import React, { useEffect } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import { useEditPostMutation, useGetPostDetailQuery } from '../../services/postAPI';

const { Option } = Select;

const EditPostModal = ({ visible, onOk, onCancel, post, refetchPostData }) => {
    const [form] = Form.useForm();
    const { data: productData, isLoading: isLoadingProduct } = useGetAllProductForExchangeQuery();
    const { data: postDetail, refetch } = useGetPostDetailQuery(post);
    const [editPost, { isLoading: isEditing }] = useEditPostMutation();

    useEffect(() => {
        if (visible && postDetail) {
            form.setFieldsValue({
                title: postDetail.title,
                description: postDetail.description,
                productId: postDetail.productId,
            });
        }
    }, [visible, postDetail, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { data } = await editPost({ id: post, body: values });

            if (data) {
                message.success('Post updated successfully');
                onOk();
                refetch(); // Refetch post detail to get updated data
                refetchPostData(); // Optionally refetch post list
            } else {
                message.error('Failed to update post');
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
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
            </Form>
        </Modal>
    );
};

export default EditPostModal;
