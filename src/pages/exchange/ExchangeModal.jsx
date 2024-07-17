import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spin, Tag, Switch, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useGetAllProductForExchangeQuery } from '../../services/productAPI';
import TableTransfer from '../../components/TableTransfer';
import { useCreateExchangeMutation } from '../../services/postAPI';

const ExchangeModal = ({ isVisible, onClose, postId }) => {
    const [form] = Form.useForm();
    const [selectedProductKeys, setSelectedProductKeys] = useState([]);
    const [description, setDescription] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createExchange] = useCreateExchangeMutation();
    const { data: productData, isLoading: isLoadingProduct, refetch } = useGetAllProductForExchangeQuery();

    const handleOk = async () => {
        try {
            setIsSubmitting(true); // Set loading to true before the request
            const values = await form.validateFields();

            const formValues = {
                productIds: selectedProductKeys,
                description: description,
                postId: parseInt(postId, 10)
            };

            try {
                const { exchange } = await createExchange(formValues);
                message.success('Exchange created successfully');
            } catch (e) {
                message.error("Error creating exchange");
            } finally {
                setIsSubmitting(false); // Reset loading to false after the request
                form.resetFields();
                setSelectedProductKeys([]);
                refetch();
                onClose();
            }
        } catch (errorInfo) {
            setIsSubmitting(false); // Reset loading to false if validation fails
            console.log('Validate Failed:', errorInfo);
        }
    };

    const handleTransferChange = (targetKeys) => {
        setSelectedProductKeys(targetKeys);
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    const columns = [
        {
            dataIndex: 'name',
            title: 'Name',
        },
        {
            dataIndex: 'categoryName',
            title: 'Category',
            render: (categoryName) => <Tag color="blue">{categoryName}</Tag>,
        },
        {
            dataIndex: 'subcategoryName',
            title: 'Subcategory',
            render: (subcategoryName) => <Tag color="green">{subcategoryName}</Tag>,
        },
    ];

    const formattedProductData = productData?.map((product) => ({
        key: product.id.toString(),
        name: product.name,
        categoryName: product.categoryName,
        subcategoryName: product.subcategoryName,
    })) || [];

    return (
        <Modal
            title="Exchange Item"
            open={isVisible}
            onOk={handleOk}
            onCancel={onClose}
            width={'fit-content'}
            style={{ top: 0, left: 0, width: '100%', height: '100%' }}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={isSubmitting}>
                    Submit
                </Button>,
            ]}
        >
            <Spin spinning={isLoadingProduct || isSubmitting}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Select Product to Exchange"
                        name="productId"
                        rules={[{ required: true, message: 'Please select a product to exchange!' }]}
                    >
                        <div style={{ width: '800px' }}>
                            <TableTransfer
                                dataSource={formattedProductData}
                                targetKeys={selectedProductKeys}
                                onChange={handleTransferChange}
                                filterOption={(inputValue, item) =>
                                    item.name.indexOf(inputValue) !== -1 ||
                                    item.categoryName.indexOf(inputValue) !== -1 ||
                                    item.subcategoryName.indexOf(inputValue) !== -1
                                }
                                leftColumns={columns}
                                rightColumns={columns}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter a description!' }]}
                    >
                        <ReactQuill value={description} onChange={handleDescriptionChange} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ExchangeModal;
