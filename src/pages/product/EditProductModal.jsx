import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, InputNumber, Image, Skeleton } from 'antd';
import { VietnameseProvinces } from '../../utils/utils';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
import { useEditProductMutation, useGetAllCategoriesForCProductQuery, useGetAllSubCategoriesQuery, useGetProductDetailQuery } from '../../services/productAPI';

const { Option } = Select;

const ModalEditProduct = ({ visible, productData, onCancel, refetchProductData }) => {
    const [form] = Form.useForm();
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategoriesForCProductQuery();
    const { data: productDetail, isLoading: isLoadingProductDetail } = useGetProductDetailQuery(productData, { skip: !productData });
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const { data: subcategories, isLoading: isLoadingSubcategories } = useGetAllSubCategoriesQuery(selectedCategoryId, {
        skip: !selectedCategoryId,
    });
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [newImageUrl, setNewImageUrl] = useState([]);

    useEffect(() => {
        if (productDetail) {
            setSelectedCategoryId(productDetail.categoryId);
        }
    }, [productDetail]);

    useEffect(() => {
        if (visible && productDetail) {
            setFilteredSubcategories(subcategories || []);
            form.setFieldsValue({
                categoryId: productDetail?.categoryId,
                subcategoryId: productDetail?.subcategoryId,
                name: productDetail?.name,
                price: productDetail?.price,
                description: productDetail?.description,
                location: productDetail?.location,
            });
            setCurrentImageUrl(productDetail?.urlImg || '');
        }
    }, [visible, productDetail, subcategories, form]);

    const [updateProduct] = useEditProductMutation();

    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryId(categoryId);
        form.setFieldsValue({ subcategoryId: undefined });
    };

    const handleImageChange = (value) => {
        setNewImageUrl(value);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const imageUrlToUpdate = newImageUrl.length > 0 ? newImageUrl[0] : currentImageUrl;
            try {
                await updateProduct({
                    id: productData,
                    body: { ...values, urlImg: imageUrlToUpdate }
                });
                message.success('Product updated successfully');
                form.resetFields();
                setNewImageUrl([]);
                refetchProductData();
                onCancel();
            } catch {
                message.error('Failed to update product');
            }
        } catch (error) {
            message.error('Failed to update product');
            console.error('Validate Failed:', error);
        }
    };

    if (isLoadingCategories || isLoadingProductDetail || isLoadingSubcategories) {
        return <Skeleton active />;
    }

    return (
        <Modal
            width={"60vw"}
            open={visible}
            title="Edit Product"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
                    <Select
                        loading={isLoadingCategories}
                        onChange={handleCategoryChange}
                        placeholder="Select Category"
                    >
                        {categories?.map(category => (
                            <Option key={category.id} value={category.id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="subcategoryId" label="Subcategory" rules={[{ required: true, message: 'Please select a subcategory' }]}>
                    <Select
                        loading={isLoadingSubcategories}
                        placeholder="Select Subcategory"
                        disabled={!filteredSubcategories.length}
                    >
                        {filteredSubcategories.map(subcategory => (
                            <Option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the product name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price' }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the description' }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please select a location' }]}>
                    <Select
                        showSearch
                        placeholder="Select Location"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {VietnameseProvinces.map(province => (
                            <Option key={province} value={province}>
                                {province}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="urlImg" label="Image">
                    <UploadWidget
                        uwConfig={{
                            multiple: true,
                            cloudName: "dnnvrqoiu",
                            uploadPreset: "estate",
                        }}
                        folder={productDetail?.urlImg ? productDetail.urlImg.split('/')[1] : `products/${productDetail?.folder}`}
                        setState={handleImageChange}
                    />
                    {newImageUrl?.length > 0 ? (
                        <img
                            src={newImageUrl[0]}
                            alt="Uploaded Image"
                            style={{ width: '300px', height: '300px', marginTop: '10px' }}
                        />
                    ) : currentImageUrl ? (
                        <img
                            src={currentImageUrl}
                            alt="Current Image"
                            style={{ width: '300px', height: '300px', marginTop: '10px' }}
                        />
                    ) : null}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEditProduct;
