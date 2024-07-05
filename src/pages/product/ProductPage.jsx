import React, { useEffect, useState } from 'react';
import { Layout, Input, Checkbox, Button, Select, Row, Col, Card, message, Pagination, Spin, Modal, Tag, Skeleton, Image, Dropdown, Menu } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined, FilterOutlined, PlusCircleOutlined, SettingOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined, MenuOutlined, MoreOutlined } from '@ant-design/icons';
import './ProductPage.scss';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import { NumericFormat } from 'react-number-format';
import { VietnameseProvinces } from '../../utils/utils';
import Search from 'antd/es/input/Search';
import { useDeleteProductMutation, useGetAllCategoriesQuery, useGetAllProductByUserIdQuery, useGetAllProductQuery } from '../../services/productAPI';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, loadCartFromLocalStorage } from '../../slices/product.slice';
import { Link, useNavigate } from 'react-router-dom';
import AddProductModal from './AddProductModal';
import { selectCurrentUser } from '../../slices/auth.slice';
import ModalEditProduct from './EditProductModal';

const { Sider, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

const ProductPage = () => {
    const { data: allProductData, isLoadingProduct, refetch: refetchProductData } = useGetAllProductQuery();
    const { data: productByUserIdData, isLoadingProductByUserId, refetch: refetchProductByIdData } = useGetAllProductByUserIdQuery();
    const { data: categoriesData, isLoadingCategories, refetch: refetchCategories } = useGetAllCategoriesQuery();
    const user = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const [deleteProduct] = useDeleteProductMutation();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalAddVisible, setIsModalAddVisible] = useState(false);
    const [isModalEditVisible, setIsModalEditVisible] = useState(false); // State for edit modal visibility
    const [selectedProduct, setSelectedProduct] = useState(null);
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
    const [showUserProducts, setShowUserProducts] = useState(false);

    useEffect(() => {
        dispatch(loadCartFromLocalStorage());
    }, [dispatch]);


    useEffect(() => {
        refetchProductaData();
    }, [refetchProductData, refetchCategories]);
    
    const handleFilterChange = (type, value) => {
        setFilters({ ...filters, [type]: value });
    };

   

    const refetchProductaData = async () => {
        await refetchProductData();
        await refetchProductByIdData();
        await refetchCategories();
    };

 


    const handleCategoryChange = (category, checked) => {
        const updatedCategories = checked
            ? [...filters.categories, category.id] // Assuming category.id is used for comparison
            : filters.categories.filter(catId => catId !== category.id);
        setFilters({ ...filters, categories: updatedCategories });
    };

    const handleSubcategoryChange = (subcategory, checked) => {
        const updatedSubcategories = checked
            ? [...filters.subcategories, subcategory.id] // Assuming subcategory.id is used for comparison
            : filters.subcategories.filter(subId => subId !== subcategory.id);
        setFilters({ ...filters, subcategories: updatedSubcategories });
    };

    const resetFilters = () => {
        setFilters({
            categories: [],
            subcategories: [],
            priceRange: [1000, 100000000],
            location: null,
        });
        setSearch('');
    };

    const filteredProducts = (showUserProducts ? productByUserIdData : allProductData)?.filter(product => {
        const categoryMatches = filters.categories.length === 0 || filters.categories.includes(product.categoryId);
        const subcategoryMatches = filters.subcategories.length === 0 || filters.subcategories.includes(product.subcategoryId);
        const priceMatches = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const locationMatches = !filters.location || product.location === filters.location;
        const searchMatches = !search ||
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            (product.subcategoryName && product.subcategoryName.toLowerCase().includes(search.toLowerCase()));

        // Condition filter logic

        return categoryMatches && subcategoryMatches && priceMatches && locationMatches && searchMatches;
    });

    const handleRedirect = () => {
        navigate("/login")
    };
    const handleAddProduct = () => {
        setIsModalAddVisible(true);
    };

    const handleModalAddOk = () => {
        setIsModalAddVisible(false);
    };

    const handleModalAddCancel = () => {
        setIsModalAddVisible(false);
    };

    //Edit Product

    const handleEditProduct = (productId) => {
        setSelectedProduct(productId);
        setIsModalEditVisible(true);
    };

    const handleModalEditOk = () => {
        setIsModalEditVisible(false);
        setSelectedProduct(null);
        refetchProductData();
    };

    const handleModalEditCancel = () => {
        setIsModalEditVisible(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = (productId) => {
        confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'Product and all Post have this product will delete. This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteProduct(productId).unwrap();
                    message.success('Product deleted successfully');
                    refetchProductData();
                    refetchProductByIdData();
                } catch (error) {
                    console.log(error);
                    if (error.originalStatus === 200) {
                        message.success('Deleted successfully');
                    } else {
                        message.error('Failed to delete the product');
                    }
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const truncateName = (name, maxChars) => {
        if (name.length > maxChars) {
            return name.slice(0, maxChars) + '...';
        }
        return name;
    };
    // const menu = (productId) => (
    //     <Menu>
    //         <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditProduct(productId)}>
    //             Edit
    //         </Menu.Item>
    //         <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(productId)}>
    //             Delete
    //         </Menu.Item>
    //     </Menu>
    // );

    const paginatedProducts = filteredProducts?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoadingProduct || isLoadingCategories || isLoadingProductByUserId) {
        return <Skeleton active />;
    } else {

        return (
            <>
                <CustomHeader />
                <Layout className="product-page">
                    <Sider width={300} className="filter-section">
                        <h3><span style={{ marginRight: '0.7rem' }}><FilterOutlined /></span>Filter</h3>
                        <div className="filter-group">
                            <p className='title-filter'>Categories</p>
                            {categoriesData?.map((category) => (
                                <div key={category.id} className='filter-checkbox-layout'>
                                    <Checkbox
                                        style={{ fontSize: '16px', fontWeight: '500' }}
                                        checked={filters.categories.includes(category.id)}
                                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                                    >
                                        {category.name}
                                    </Checkbox>
                                    <div className="subcategories">
                                        {category.subCategories?.map(sub => (
                                            <Col key={sub.id}>
                                                <Checkbox
                                                    className='subcategories-checkbox'
                                                    checked={filters.subcategories.includes(sub.id)}
                                                    onChange={(e) => handleSubcategoryChange(sub, e.target.checked)}
                                                >
                                                    {sub.name}
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
                            <Search
                                placeholder="input search text"
                                onSearch={(e) => setSearch(e)}
                                enterButton
                                className="search-input"
                            />
                            <div className="view-buttons">
                                <Button icon={<AppstoreOutlined />} onClick={() => setView('grid')}>4 per row</Button>
                                <Button icon={<BarsOutlined />} onClick={() => setView('list')}>1 per row</Button>
                            </div>
                            <div className="toggle-buttons">
                                <Button
                                    className={!showUserProducts ? 'active' : ''}
                                    onClick={() => setShowUserProducts(false)}

                                >
                                    All Products
                                </Button>
                                <Button
                                    className={showUserProducts ? 'active' : ''}
                                    onClick={() => setShowUserProducts(true)}
                                >
                                    My Products
                                </Button>
                            </div>
                            {user ? (
                                <Button
                                    icon={<PlusCircleOutlined />}
                                    size='large'
                                    onClick={handleAddProduct}
                                    type='primary' > Add product</Button>
                            ) : (
                                <Button
                                    icon={<PlusCircleOutlined />}
                                    size='large'
                                    type='primary'
                                    onClick={handleRedirect}
                                >Add product</Button>
                            )}
                        </div>
                        <div className={`product-list ${view}`}>
                            <Row gutter={[16, 16]}>
                                {paginatedProducts?.map(product => (
                                    <Col key={product?.id} span={view === 'grid' ? 6 : 24}>

                                        <Card className="card-product">
                                            {user?.id === product?.userId ? (
                                                <div className='dropdown-menu'>
                                                    <Dropdown overlay={
                                                        <Menu>
                                                            <Menu.Item key="edit" icon={<EditOutlined style={{ color: '#EEC900' }} />} onClick={() => handleEditProduct(product.id)}>
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item key="delete" icon={<DeleteOutlined style={{ color: '#EE2C2C' }} />} onClick={() => handleDeleteProduct(product.id)}>
                                                                Delete
                                                            </Menu.Item>
                                                        </Menu>
                                                    } trigger={['hover']}>
                                                        <Button type="text" icon={<SettingOutlined style={{ fontSize: '20px' }} />} size="large" />
                                                    </Dropdown>
                                                </div>
                                            ) : null}
                                            <Link
                                                to={`/productDetail/${product?.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ color: 'black' }}
                                            >

                                                <Image
                                                    src={product?.urlImg}
                                                    className="product-image"
                                                    preview={false}
                                                />
                                                <div className="card-content">
                                                    <p className="card-product-name">{truncateName(product?.name, 20)}</p>
                                                    <p className="card-product-price">
                                                        Price: <span className="price-highlight"><span style={{ color: '#f05d40' }}>{product?.price}  ₫</span></span>
                                                    </p>
                                                    <p>Location: <span style={{ fontWeight: 'bold' }}>{product?.location}</span></p>
                                                </div>
                                            </Link>

                                        </Card>

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
                <AddProductModal
                    visible={isModalAddVisible}
                    onOk={handleModalAddOk}
                    onCancel={handleModalAddCancel}
                    refetchProductData={refetchProductData}
                />
                <ModalEditProduct
                    visible={isModalEditVisible}
                    onOk={handleModalEditOk}
                    onCancel={handleModalEditCancel}
                    productData={selectedProduct}
                    refetchProductData={refetchProductData}
                />
            </>
        );
    }
};

export default ProductPage;
