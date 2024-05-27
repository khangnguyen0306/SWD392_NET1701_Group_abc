import React, { useEffect, useState } from 'react';
import { Layout, Input, Checkbox, Slider, Button, Select, Row, Col, Card, message, Pagination } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined, FilterOutlined } from '@ant-design/icons';
import './ProductPage.scss';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import { NumericFormat } from 'react-number-format';
import { VietnameseProvinces } from '../../utils/utils';
import Search from 'antd/es/input/Search';
import { useGetAllCategoriesQuery, useGetAllProductQuery } from '../../services/productAPI';
import { useDispatch } from 'react-redux';
import { addToCart, loadCartFromLocalStorage } from '../../slices/product.slice';
import { Link } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Option } = Select;


const ProductPage = () => {
    const { data: productData, isLoadingProduct } = useGetAllProductQuery();
    const { data: categoriesData, isLoadingCategories } = useGetAllCategoriesQuery();
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 24;
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        categories: [],
        subcategories: [],
        priceRange: [1000, 100000000],
        condition: [],
        location: null,
    });

    useEffect(() => {
        dispatch(loadCartFromLocalStorage());
    }, [dispatch]);

    // const handleAddToCart = (product) => {
    //     const isProductInCart = cart.some(item => item.id === product.id);

    //     if (isProductInCart) {
    //         message.error('Product is already in the cart!');
    //     } else {
    //         dispatch(addToCart({ ...product, quantity: 1 }));
    //         message.success('Product added to cart successfully!');
    //     }
    // };


    const handleFilterChange = (type, value) => {
        setFilters({ ...filters, [type]: value });
    };

    const handleCategoryChange = (category, checked) => {
        const updatedCategories = checked ? [...filters.categories, category] : filters.categories.filter(cat => cat !== category);
        setFilters({ ...filters, categories: updatedCategories });
    };

    const handleSubcategoryChange = (subcategory, checked) => {
        const updatedSubcategories = checked ? [...filters.subcategories, subcategory] : filters.subcategories.filter(sub => sub !== subcategory);
        setFilters({ ...filters, subcategories: updatedSubcategories });
    };

    // const handleConditionChange = (condition, checked) => {
    //     const updatedConditions = checked ? [...filters.condition, condition] : filters.condition.filter(con => con !== condition);
    //     setFilters({ ...filters, condition: updatedConditions });
    // };

    const resetFilters = () => {
        setFilters({
            categories: [],
            subcategories: [],
            priceRange: [1000, 100000000],
            condition: [],
            location: null,
        });
        setSearch('');
    };

    // Dummy product data

    const filteredProducts = productData?.filter(product => {
        return (
            (filters.categories.length === 0 || filters.categories.includes(product.category)) &&
            (filters.subcategories.length === 0 || filters.subcategories.includes(product.subcategory)) &&
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1] &&
            (filters.condition.length === 0 || filters.condition.some(condition => {
                if (condition === '50-70' && product.condition >= 50 && product.condition <= 70) return true;
                if (condition === '70-90' && product.condition > 70 && product.condition <= 90) return true;
                if (condition === '90+' && product.condition > 90) return true;
                return false;
            })) &&
            (!filters.location || product.location === filters.location) &&
            (
                !search ||
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.subcategory.toLowerCase().includes(search.toLowerCase())
            )
        );
    });

    const paginatedProducts = filteredProducts?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoadingProduct && isLoadingCategories) {
        return <div>Loading...</div>
    }
    return (
        <>
            <CustomHeader />

            <Layout className="product-page">
                <Sider width={300} className="filter-section">
                    <h3> <span style={{ marginRight: '0.7rem' }}><FilterOutlined /></span>Filter</h3>
                    <div className="filter-group">
                        <p className='title-filter'>Categories</p>
                        {categoriesData?.map((category) => (
                            <div key={category.id} className='filter-checkbox-layout'>
                                <Checkbox
                                    style={{ fontSize: '16px', fontWeight: '500' }}
                                    onChange={(e) => handleCategoryChange(category.name, e.target.checked)}
                                >
                                    {category.name}
                                </Checkbox>
                                <div className="subcategories">
                                    {category.subcategories?.map((sub) => (
                                        <Col key={category.subcategories.name}>
                                            <Checkbox
                                                className='subcategories-checkbox'
                                                key={sub.id}
                                                onChange={(e) => handleSubcategoryChange(sub, e.target.checked)}
                                            >
                                                {sub}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="filter-group">
                        <p className='title-filter'>Price</p>
                        <label>From</label>
                        <NumericFormat
                            style={{ padding: '10px', marginBottom: '10px' }}
                            thousandSeparator={true}
                            prefix={'₫ '}
                            placeholder="From"
                            value={filters.priceRange[0]}
                            onValueChange={(values) => {
                                const { floatValue } = values;
                                handleFilterChange('priceRange', [floatValue, filters.priceRange[1]]);
                            }}
                            customInput={Input}
                        />
                        <label className='label-price-input'>To</label>
                        <NumericFormat
                            style={{ padding: '10px' }}
                            thousandSeparator={true}
                            prefix={'₫ '}
                            placeholder="To"
                            value={filters.priceRange[1]}
                            onValueChange={(values) => {
                                const { floatValue } = values;
                                handleFilterChange('priceRange', [filters.priceRange[0], floatValue]);
                            }}
                            customInput={Input}
                        />
                    </div>
                    <div className="filter-group">
                        <h4>Condition</h4>
                        <Checkbox.Group
                            onChange={(checkedValues) => handleFilterChange('condition', checkedValues)}
                        >
                            <Checkbox value="50-70">50-70%</Checkbox>
                            <Checkbox value="70-90">70-90%</Checkbox>
                            <Checkbox value="90+">90%+</Checkbox>
                        </Checkbox.Group>
                    </div>
                    <div className="filter-group">
                        <h4>Location</h4>
                        <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="Select Location"
                            value={filters.location}
                            onChange={(value) => handleFilterChange('location', value)}
                            filterOption={(input, option) => (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            filterSort={(optionA, optionB) => optionA.children.localeCompare(optionB.children)}
                        >
                            {VietnameseProvinces.map((location) => (
                                <Option key={location} value={location}>{location}</Option>
                            ))}
                        </Select>
                    </div>
                    <Button type="primary" onClick={resetFilters}>Reset Filters</Button>
                </Sider>
                <Content className="product-section">
                    <div className="product-header">
                        <Search placeholder="input search text"
                            onSearch={(e) => setSearch(e)}
                            enterButton
                            className="search-input"
                        />

                        <div className="view-buttons">
                            <Button icon={<AppstoreOutlined />} onClick={() => setView('grid')}>4 per row</Button>
                            <Button icon={<BarsOutlined />} onClick={() => setView('list')}>1 per row</Button>
                        </div>
                    </div>
                    <div className={`product-list ${view}`}>
                        <Row gutter={[16, 16]}>
                            {paginatedProducts?.map(product => (
                                <Col key={product.id} span={view === 'grid' ? 6 : 24}>
                                    <Link to={`/productDetail/${product.id}`}>
                                        <Card className='card-product'>
                                            <img src={product?.imageURL} width={"190px"} height={"170px"} className='product-image' />
                                            <p className='card-product-name'>{product.name}</p>
                                            <p className='card-product-price'>Price: <span style={{color:'#000',fontWeight:'bold'}}>{product.price}₫</span></p>
                                            <p>Condition: {product.condition}%</p>
                                            <p>Location: {product.location}</p>
                                            {/* <Button type='primary' onClick={() => handleAddToCart(product)}>Add to cart</Button> */}

                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </div>
                    <div className="pagination">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredProducts?.length || 0}
                            onChange={handlePageChange}
                        />
                    </div>
                </Content>
            </Layout>
            <CustomFooter />
        </>
    );
};

export default ProductPage;
