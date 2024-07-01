import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, InputNumber, Image } from 'antd';
import { useCreateProductMutation, useGetAllCategoriesForCProductQuery, useGetAllSubCategoriesQuery } from '../../services/productAPI';
import { VietnameseProvinces } from '../../utils/utils';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const ModalAddProduct = ({ visible, onOk, onCancel,refetchProductData }) => {
    const [form] = Form.useForm();
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategoriesForCProductQuery();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const { data: subcategories, isLoading: isLoadingSubcategories } = useGetAllSubCategoriesQuery(selectedCategoryId, {
        skip: !selectedCategoryId,
    });

    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [images, setImages] = useState([]);
    const [addProduct]= useCreateProductMutation();
    const [folder] = useState(uuidv4());

    useEffect(() => {
        setFilteredSubcategories(subcategories || []);
    }, [subcategories]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryId(categoryId);
        form.setFieldsValue({ subcategoryId: undefined }); // Reset subcategory when category changes
    };

    const handleImageChange = (value) => {
        setImages(value);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            try {
                await addProduct({ ...values, urlImg: images[0] });
                message.success('Product added successfully');
                refetchProductData();
                onOk(); // Close the modal on success
            } catch (error) {
                message.error('Failed to add product');
            }
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    return (
        <Modal
            open={visible}
            title="Add Product"
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
                <Form.Item name="subcategoryId" label="Subcategory" >
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
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                      <Input />
                </Form.Item>
                {/* <Form.Item name="condition" label="Condition" rules={[{ required: true, message: 'Please enter the condition' }]}>
                    <Input min={1} max={100} suffix={"%"} />
                </Form.Item> */}
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
                        folder={`products/${folder}`}
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
                {/* <Form.Item name="stockQuantity" label="Stock Quantity" rules={[{ required: true, message: 'Please enter the stock quantity' }]}>
                    <Input type="number" />
                </Form.Item> */}
            </Form>
        </Modal>
    );
};

export default ModalAddProduct;
