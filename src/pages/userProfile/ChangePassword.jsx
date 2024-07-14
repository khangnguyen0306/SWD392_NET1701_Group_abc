import React from 'react';
import { Form, Input, Checkbox, Button, message, Switch } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { validationPatterns } from '../../utils/utils';
import { useUpdatePasswordMutation } from '../../services/userAPI';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const ChangePassword = ({ form, isUpdatePassword, setIsUpdatePassword }) => {
    const user = useSelector(selectCurrentUser);
    const [updatePassword] = useUpdatePasswordMutation();

    const handleSubmit = async (values) => {
        try {
            await updatePassword({ id: user.id, password: values.password }).unwrap();
            message.success("Password updated successfully");
        } catch (error) {
            message.error("Failed to update password");
        }
    };

    return (
        <>
            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                <Switch checked={isUpdatePassword} onChange={(checked) => setIsUpdatePassword(checked)} />
                <span style={{ marginLeft: '0.5rem' }}>Change Password</span>
            </div>

            {isUpdatePassword && (
                <Form
                    form={form}
                    name="changePassword"
                    onFinish={handleSubmit}
                >
                    <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                        <label id='newPassword'>New Password</label>
                        <Form.Item
                            hasFeedback
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    pattern: validationPatterns.password.pattern,
                                    message: validationPatterns.password.message
                                }
                            ]}
                        >
                            <Input.Password placeholder="Password" className="form-input"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    </div>
                    <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                        <label id='retypePassword'>Retype Password</label>
                        <Form.Item
                            name="retypePassword"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please retype the password!',
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
                        >
                            <Input.Password
                                placeholder="Re-type password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );
};

export default ChangePassword;
