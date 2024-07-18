import React from 'react';
import { Form, Input, Switch, Button, message } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { validationPatterns } from '../../utils/utils';
import { useUpdatePasswordMutation } from '../../services/userAPI';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import './ChangePassword.scss';

const ChangePassword = ({ form, isUpdatePassword, setIsUpdatePassword }) => {
    const user = useSelector(selectCurrentUser);
    const [updatePassword] = useUpdatePasswordMutation();

    const handleSubmit = async (values) => {
        try {
            await updatePassword({
                userId: user.id,
                newPassword: values.password,
                oldPassword: values.oldPassword
            }).unwrap();
            message.success("Your password has been successfully updated.");
        } catch (error) {
            if (error.status === 400) {
                message.error("Failed to update password: Incorrect old password.");
            } else {
                message.error("Failed to update password: Please try again later.");
            }
        }
    };

    return (
        <div className='change-password-container'>
            <div className='change-password-toggle'>
                <Switch checked={isUpdatePassword} onChange={(checked) => setIsUpdatePassword(checked)} />
                <span className='change-password-label' style={{marginLeft:'1rem'}}>  Change Password</span>
            </div>

            {isUpdatePassword && (
                <Form
                    form={form}
                    name="changePassword"
                    onFinish={handleSubmit}
                    className='change-password-form'
                >
                    <Form.Item
                        label="Old Password"
                        name="oldPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your old password!',
                            }
                        ]}
                        className='change-password-form-item'
                    >
                        <Input.Password placeholder="Old Password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="password"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                pattern: validationPatterns.password.pattern,
                                message: validationPatterns.password.message
                            }
                        ]}
                        className='change-password-form-item'
                    >
                        <Input.Password placeholder="New Password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Retype New Password"
                        name="retypePassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please retype the new password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The passwords do not match!'));
                                },
                            }),
                        ]}
                        className='change-password-form-item'
                    >
                        <Input.Password placeholder="Retype New Password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item className='change-password-form-item'>
                        <Button type="primary" htmlType="submit" className='change-password-button'>
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default ChangePassword;
