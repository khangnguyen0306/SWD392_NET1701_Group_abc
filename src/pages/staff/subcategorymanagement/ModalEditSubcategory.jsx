import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Spin, message, Skeleton } from 'antd';
import { useGetAllCategoriesForCProductQuery, useGetSubCategoryByIdQuery } from '../../../services/productAPI';

const ModalEditSubcategory = ({ visible, onEdit, onCancel, subcategoryId }) => {
    const [form] = Form.useForm();
    const { data: categories, isLoading: categoriesLoading } = useGetAllCategoriesForCProductQuery();
    const { data: subcategoryDetail, isLoading: subcategoryLoading, error, refetch } = useGetSubCategoryByIdQuery(subcategoryId);
    console.log(subcategoryDetail)

    useEffect(() => {
        refetch();
        if (visible && subcategoryDetail) {
            form.setFieldsValue({
                categoryId: subcategoryDetail.categoryId,
                name: subcategoryDetail.name,
                description: subcategoryDetail.description,
            });
        }
    }, [visible, subcategoryDetail, form, refetch]);



    const handleOk = () => {
        form.validateFields()
            .then(values => {
                form.resetFields();
                onEdit(values);
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    if (categoriesLoading && subcategoryLoading) {
        return <Skeleton active />;
    }

    return (
        <Modal
            open={visible}
            title="Edit Subcategory"
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Save
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    {categoriesLoading ? (
                        <Spin />
                    ) : (
                        <Select placeholder="Select a category">
                            {categories.map(category => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Subcategory Name"
                    rules={[{ required: true, message: 'Please input the name of the subcategory!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
            {subcategoryLoading && <Spin />}
        </Modal>
    );
};

export default ModalEditSubcategory;
