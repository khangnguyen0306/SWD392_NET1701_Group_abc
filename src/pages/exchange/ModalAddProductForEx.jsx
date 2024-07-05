import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, message, Image, Row, Col } from 'antd';
import { useCreateProductForExchangeMutation, useGetAllCategoriesForCProductQuery, useGetAllProductForExchangeQuery, useGetAllSubCategoriesQuery } from '../../services/productAPI';
import { VietnameseProvinces } from '../../utils/utils';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { NumberFormatBase } from 'react-number-format';
const { Option } = Select;

const AddProductPage = () => {
    const [form] = Form.useForm();
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategoriesForCProductQuery();
    const { refetch } = useGetAllProductForExchangeQuery();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const { data: subcategories, isLoading: isLoadingSubcategories } = useGetAllSubCategoriesQuery(selectedCategoryId, {
        skip: !selectedCategoryId,
    });

    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [images, setImages] = useState([]);
    const [addProduct] = useCreateProductForExchangeMutation()
    const [folder] = useState(uuidv4());
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredSubcategories(subcategories || []);
    }, [subcategories]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryId(categoryId);
        form.setFieldsValue({ subcategoryId: undefined });
    };

    const handleImageChange = (value) => {
        setImages(value);
    };
    const handleBack = (value) => {
        navigate(-1);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            try {
                await addProduct({ ...values, urlImg: images[0] });
                message.success('Product added successfully');
                refetch();
                navigate(-1)
            } catch (error) {
                message.error('Failed to add product');
            }
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%', marginTop: '6rem' }}>
            <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={14}>


                <div className="form-container">

                    <Button onClick={handleBack} type='primary' icon={<ArrowLeftOutlined />} style={{ position: 'absolute', left: '-10rem', top: '50px' }}>Back</Button>
                    <h1 className="form-title" style={{ margin: '2rem 0' }}>Add Product</h1>
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
                       <Form.Item name="price" label="Price" rules={[
                            { required: true, message: 'Please enter the price' },
                            {
                                validator: async (_, value) => {
                                    if (value && parseInt(value.replace(/\D/g, ''), 10) > 1000000000) {
                                        throw new Error('Price cannot exceed 1,000,000,000');
                                    }
                                }
                            }
                        ]}>
                            <NumberFormatBase
                                allowNegative={false}
                                min={0}
                                max={1000000000}
                                thousandSeparator=","
                                prefix="₫"
                                decimalScale={0}
                                className="ant-input"
                                customInput={Input}
                                displayType="input"
                            />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the description' }]}>
                            <Input.TextArea rows={4} />
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
                                folder={`productsForExchange/${folder}`}
                                setState={handleImageChange}
                            />
                            <div className="uploaded-images-container">
                                {images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt={`Uploaded Image ${index + 1}`}
                                        width={200}
                                        className="uploaded-image"
                                    />
                                ))}
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" block onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};

export default AddProductPage;

