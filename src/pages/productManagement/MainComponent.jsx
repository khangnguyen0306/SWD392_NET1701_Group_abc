import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
// import TableProductsForExchange from './TableProductsForExchange';
import TableProductForSale from './Product-for-sale/TableProduct';
import { useGetAllProductForExchangeStaffQuery, useGetAllProductQuery } from '../../services/productAPI';
import TableProductForExchange from './Product-for-exchange/TableProduct';

const { TabPane } = Tabs;

const MainComponent = () => {
    const { data: productsForSale, error: errorSale, isLoading: loadingSale, refetch: refetchProductData } = useGetAllProductQuery();
    const { data: productsForExchange, error: errorExchange, isLoading: loadingExchange, refetch: refetchProductExchange } = useGetAllProductForExchangeStaffQuery();

    return (
        <Tabs defaultActiveKey="1" style={{ width: '100%', marginTop: '6rem' }}>
            <TabPane tab="Products for Sale" key="1" style={{ width: '100%' }}>
                {loadingSale ? (
                    <p>Loading...</p>
                ) : errorSale ? (
                    <p>Error loading products for sale</p>
                ) : (
                    <div style={{ width: '100%', height: '100%' }}>
                        <TableProductForSale
                            productData={productsForSale}
                            refetchProductData={refetchProductData}
                        />
                    </div>
                )}
            </TabPane>
            <TabPane tab="Products for Exchange" key="2">
                {loadingExchange ? (
                    <p>Loading...</p>
                ) : errorExchange ? (
                    <p>Error loading products for exchange</p>
                ) : (
                    <TableProductForExchange
                        productData={productsForExchange}
                        refetchProductData={refetchProductExchange}
                    />

                )}
            </TabPane>
        </Tabs>
    );
};

export default MainComponent;
