import React from 'react';
import { Modal, Form, Input } from 'antd';

const AddPostModal = ({ handleCancel, handleOk, visible, form }) => {
  return (
    <Modal
      title="Add Post"
      visible={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="createdBy" label="Created By" rules={[{ required: true, message: 'Please input the creator!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="dateCreated" label="Date Created" rules={[{ required: true, message: 'Please input the date!' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPostModal;
