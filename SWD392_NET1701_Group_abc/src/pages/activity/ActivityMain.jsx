import React from 'react';
import { Tabs } from 'antd';
import ExchangeRequest from './Exchangerequest';
import MyExchange from './MyExchange';

const { TabPane } = Tabs;

const ActivityMain = () => {
    return (
        <div className="activity-main" style={{ marginTop: '7rem', width: '100%',minHeight:'100vh' }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Exchange Requests" key="1">
                    <ExchangeRequest />
                </TabPane>
                <TabPane tab="My Exchange" key="2">
                    <MyExchange />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ActivityMain;
