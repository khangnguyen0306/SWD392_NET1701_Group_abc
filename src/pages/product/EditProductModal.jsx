import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, InputNumber, Image, Skeleton } from 'antd';
import { VietnameseProvinces } from '../../utils/utils';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
import { useEditProductMutation, useGetAllCategoriesForCProductQuery, useGetAllSubCategoriesQuery, useGetProductDetailQuery } from '../../services/productAPI';
import { NumericFormat } from 'react-number-format';

const { Option } = Select;

const ModalEditProduct = ({ visible, productData, onCancel, refetchProductData }) => {
    const [form] = Form.useForm();
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategoriesForCProductQuery();
    const { data: productDetail, isLoading: isLoadingProductDetail, refetch } = useGetProductDetailQuery(productData, { skip: !productData });
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const { data: subcategories, isLoading: isLoadingSubcategories, refetch: refetchSubcategories } = useGetAllSubCategoriesQuery(selectedCategoryId, { skip: !selectedCategoryId });
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [newImageUrl, setNewImageUrl] = useState([]);
    const [price, setPrice] = useState(0);
    useEffect(() => {
        if (productDetail) {
            setSelectedCategoryId(productDetail.categoryId);
        }
    }, [productDetail]);
    useEffect(() => {
        if (selectedCategoryId) {
            refetchSubcategories();
        }
    }, [selectedCategoryId, refetchSubcategories]);


    useEffect(() => {
        if (visible && productDetail) {
            refetch();
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
    }, [visible, productDetail, form, refetch]);

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
                const update = await updateProduct({
                    id: productData,
                    body: { ...values, urlImg: imageUrlToUpdate,price}
                });
                console.log(update);
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
                        value={selectedCategoryId}
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
                        value={form.getFieldValue('subcategoryId')}
                    >
                        {subcategories?.map(subcategory => (
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
                    <NumericFormat
                        style={{ padding: '10px', marginBottom: '10px' }}
                        thousandSeparator={true}
                        prefix={'₫ '}
                        onValueChange={(values) => {
                            const { floatValue } = values;
                            setPrice(floatValue);
                        }}
                        isAllowed={(values) => {
                            const { floatValue } = values;
                            return floatValue >= 0 && floatValue <= 100000000;
                        }}
                    />
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
                        <div>
                            <img
                                src={newImageUrl[0]}
                                alt="Uploaded Image"
                                style={{ width: '300px', height: '300px', marginTop: '10px' }}
                            />
                        </div>
                    ) : currentImageUrl ? (
                        <div>
                            <img
                                src={currentImageUrl}
                                alt="Current Image"
                                style={{ width: '300px', height: '300px', marginTop: '10px' }}
                            />
                        </div>
                    ) : null}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEditProduct;
