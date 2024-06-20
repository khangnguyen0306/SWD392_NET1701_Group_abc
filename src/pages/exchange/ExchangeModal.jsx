import React, { useState } from 'react';
import { Modal, Button, Form, Spin, Tag, Switch } from 'antd';
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
    const [createExchange] = useCreateExchangeMutation();
    const { data: productData, isLoading: isLoadingProduct } = useGetAllProductForExchangeQuery();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (!isLocked) {
                console.log('Please lock the exchange before submitting.');
                return;
            }

            const formValues = {
                productIds: selectedProductKeys,
                description: description,
                postId: parseInt(postId, 10)
            };

            await createExchange(formValues); 

            onClose(); // Close modal or perform other actions after successful exchange creation
        } catch (errorInfo) {
            console.log('Validate Failed:', errorInfo);
        }
    };

    const handleTransferChange = (targetKeys) => {
        setSelectedProductKeys(targetKeys);
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    const handleLockChange = (checked) => {
        setIsLocked(checked);
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

    const formattedProductData =
        productData?.map((product) => ({
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
                <Button key="submit" type="primary" onClick={handleOk} disabled={!isLocked}>
                    Submit
                </Button>,
            ]}
        >
            <Spin spinning={isLoadingProduct}>
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
                    <Form.Item label="Lock Exchange">
                        <Switch checked={isLocked} onChange={handleLockChange} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ExchangeModal;
