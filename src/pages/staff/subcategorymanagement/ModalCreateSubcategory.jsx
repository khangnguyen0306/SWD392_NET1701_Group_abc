import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Spin } from 'antd';
import { useGetAllCategoriesForCProductQuery } from '../../../services/productAPI';

const ModalCreateSubcategory = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const { data: categories, isLoading, refetch } = useGetAllCategoriesForCProductQuery();
  console.log(categories)

  useEffect(() => {
    if (visible && categories) {
      refetch();
    }
  }, [visible, refetch])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log(values)
        form.resetFields();
        onCreate(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={visible}
      title="Create Subcategory"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Create
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
          {isLoading ? (
            <Spin />
          ) : (
            <Select placeholder="Select a category">
            {categories?.filter(category => category.status).map(category =>  (
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
    </Modal>
  );
};

export default ModalCreateSubcategory;
