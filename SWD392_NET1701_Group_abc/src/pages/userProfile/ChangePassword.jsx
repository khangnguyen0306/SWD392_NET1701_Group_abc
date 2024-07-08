import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { validationPatterns } from '../../utils/utils';


const ChangePassword = ({ form, isUpdatePassword, setIsUpdatePassword }) => {
    return (
        <>
            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                <Checkbox onChange={(e) => setIsUpdatePassword(e.target.checked)}>Change Password</Checkbox>
            </div>

            {isUpdatePassword && (
                <>
                    <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                        <label id='newPassword'>New Password</label>
                        <Form.Item
                            hasFeedback
                            name="password"
                            rules={[
                                {
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
                            rules={[
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
                </>
            )}
        </>
    );
};

export default ChangePassword;
