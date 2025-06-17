import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';
import { ProductType } from '../../../types/Types';
import '../doctors/Doctor.css';
import './Product.css';

const Product = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsData, setProductsData] = useState<ProductType[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addForm, setAddForm] = useState<ProductType>({
        product_id: '',
        title: '',
        description: '',
        price: 0,
        sold_count: 0,
        availability: true,
        image: '',
    });
    const [editForm, setEditForm] = useState<ProductType | null>(null);
    const itemsPerPage = 5;

    const fetchProducts = () => {
        setLoading(true);
        axiosInstance.get('/product')
            .then(res => {
                const filtered = res.data.map((pro: any) => ({
                    _id: pro._id,
                    product_id: pro.product_id,
                    title: pro.title,
                    description: pro.description,
                    price: pro.price,
                    sold_count: pro.sold_count,
                    availability: pro.availability,
                    image: pro.image,
                }));
                setProductsData(filtered);
                setLoading(false);
            })
            .catch(() => {
                setProductsData([]);
                setLoading(false);
            })
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = productsData.filter(product => 
        (product.product_id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (product.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (product.price?.toString().includes(searchTerm.toLowerCase()) || '') ||
        (product.sold_count?.toString().includes(searchTerm.toLowerCase()) || '') ||
        (product.availability?.toString().includes(searchTerm.toLowerCase()) || '') 
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Add Product
    const handleAddProduct = () => {
        setShowAddForm(true);
    };

    const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "availability") {
            setAddForm(prev => ({ ...prev, availability: value === "true" }));
        } else if (name === "price" || name === "sold_count") {
            setAddForm(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setAddForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.product_id || addForm.product_id.trim() === '') {
            alert('Product ID is required!');
            return;
        }
        try {
            await axiosInstance.post('/product', addForm);
            setShowAddForm(false);
            setAddForm({
                product_id: '',
                title: '',
                description: '',
                price: 0,
                sold_count: 0,
                availability: true,
                image: '',
            });
            fetchProducts();
            alert('Thêm sản phẩm thành công!');
        } catch (err: any) {
            if (err?.response?.data?.message) {
                alert(err.response.data.message);
            }
            else {
                alert('Thêm sản phẩm thất bại!');
            }
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setAddForm({
            product_id: '',
            title: '',
            description: '',
            price: 0,
            sold_count: 0,
            availability: true,
            image: '',
        });
    };

    // Edit product
    const handleEditProduct = (productID: string) => {
        const pro = productsData.find(pro => pro._id === productID);
        if (pro) {
            setEditForm(pro);
            setShowEditForm(true);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editForm) return;
        const { name, value } = e.target;
        if (name === "availability") {
            setEditForm({
                ...editForm,
                availability: value === "true"
            });
        } else if (name === "price" || name === "sold_count") {
            setEditForm({
                ...editForm,
                [name]: Number(value)
            });
        } else {
            setEditForm({
                ...editForm,
                [name]: value
            });
        }
    };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!editForm || !editForm._id) return;
        if (!editForm.product_id || editForm.product_id.trim() === '') {
            alert('Product ID is required!');
            return;
        }
        try {
            const dataTosend: any = {
                product_id: editForm.product_id,
                title: editForm.title,
                description: editForm.description,
                price: editForm.price,
                sold_count: editForm.sold_count,
                availability: editForm.availability,
                image: editForm.image,
            };
            await axiosInstance.patch(`/product/${editForm._id}`, dataTosend);
            setShowEditForm(false);
            setEditForm(null);
            fetchProducts();
            alert('Cập nhật sản phẩm thành công!');
        } catch (err: any) {
            if (err?.response?.data?.message) {
                alert(err.response.data.message);
            }
            else {
                alert('Cập nhật sản phẩm thất bại!');
            }
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditForm(null);
    };

    // Delete product
    const handleDeleteProduct = async (productID: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
            try {
                await axiosInstance.delete(`/product/${productID}`);
                setProductsData(prev => prev.filter(pro => pro._id !== productID));
                alert('Xoá sản phẩm thành công!');
            } catch (err: any) {
                alert('Xoá sản phẩm thất bại!');
            }
        }
    };

    // Page
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm]);

    return (
        <div className='doctor_container'>
            {/* header */}
            <div className='doctor_header'>
                <div className='doctor_title'>List of products</div>
                <div className='doctor_controls'>
                    {/* Search */}
                    <div className="doctor_search_container">
                        <svg className="doctor_search_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Find a product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="doctor_search_input"
                        />
                    </div>
                    {/* Button add */}
                    <button
                        onClick={handleAddProduct}
                        className="doctor_add_button"
                    >
                        Add new product
                    </button>
                </div>
            </div>

            {/* Add product form */}
            {showAddForm && (
                <div className="doctor_add_form_overlay">
                    <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
                        <h3>Thêm sản phẩm mới</h3>
                        <input name="product_id" placeholder="Product ID" value={addForm.product_id} onChange={handleAddFormChange} required />
                        <input name="title" placeholder="Title" value={addForm.title} onChange={handleAddFormChange} required />
                        <input name="description" placeholder="Description" value={addForm.description} onChange={handleAddFormChange} required />
                        <input name="price" type="number" placeholder="Price" value={addForm.price} onChange={handleAddFormChange} required />
                        <input name="sold_count" type="number" placeholder="Sold Count" value={addForm.sold_count} onChange={handleAddFormChange} />
                        <select name="availability" value={addForm.availability ? "true" : "false"} onChange={handleAddFormChange} required>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <input name="image" placeholder="Image URL" value={addForm.image} onChange={handleAddFormChange} required />
                        <div className="doctor_add_form_buttons">
                            <button type="submit" className="doctor_add_button">Lưu</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelAdd}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit product form */}
            {showEditForm && editForm && (
                <div className='doctor_add_form_overlay'>
                    <form className='doctor_add_form' onSubmit={handleEditFormSubmit}>
                        <h3>Cập nhật sản phẩm</h3>
                        <input name="product_id" placeholder="Product ID" value={editForm.product_id} onChange={handleEditFormChange} required />
                        <input name="title" placeholder="Title" value={editForm.title} onChange={handleEditFormChange} required />
                        <input name="description" placeholder="Description" value={editForm.description} onChange={handleEditFormChange} required />
                        <input name="price" type="number" placeholder="Price" value={editForm.price} onChange={handleEditFormChange} required />
                        <input name="sold_count" type="number" placeholder="Sold Count" value={editForm.sold_count} onChange={handleEditFormChange} />
                        <select name="availability" value={editForm.availability ? "true" : "false"} onChange={handleEditFormChange} required>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <input name="image" placeholder="Image URL" value={editForm.image} onChange={handleEditFormChange} required />
                        <div className='doctor_add_form_buttons'>
                            <button type="submit" className="doctor_add_button">Lưu</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelEdit}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className='doctor_table'>
                {/* Table Header */}
                <div className='doctor_table_header'>
                    <div className='product_table_header_grid'>
                        <div className='doctor_table_header_item'>ID</div>
                        <div className='doctor_table_header_item'>Title</div>
                        <div className='doctor_table_header_item'>Description</div>
                        <div className='doctor_table_header_item'>Image</div>
                        <div className='doctor_table_header_item'>Price</div>
                        <div className='doctor_table_header_item'>Sold Count</div>
                        <div className='doctor_table_header_item'>Availability</div>
                        <div>Operation</div>
                    </div>
                </div>
                {/* Table Body */}
                <div className="doctor_table_body">
                    {loading ? (
                        <div className="doctor_no_results">Đang tải...</div>
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <div key={product._id} className="doctor_table_row">
                                <div className="product_table_row_grid">
                                    <div className="doctor_cell_id">
                                        {product.product_id}
                                    </div>
                                    <div className="doctor_cell_name">
                                        {product.title}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_specialty">
                                        {product.description}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_experience">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                                    <div className="doctor_rating">
                                        {product.price}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_phone">
                                        {product.sold_count}
                                    </div>
                                    <div>{product.availability ? "Yes" : "No"}</div>
                                    <div className="doctor_actions">
                                        <button
                                            onClick={() => handleEditProduct(product._id!)}
                                            className="action_button edit_button"
                                            title="Edit Product"
                                        >
                                            <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Fix
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id!)}
                                            className="action_button delete_button"
                                            title="Delete Product"
                                        >
                                            <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ):(
                        <div className="doctor_no_results">
                            No suitable product found
                        </div>
                    )}
                </div>
            </div>

            {/* Summary and Pagination */}
            <div className='doctor_summary'>
                <div>
                    Show {currentProducts.length} / {filteredProducts.length} products
                </div>

                {totalPages > 1 && (
                    <div className='doctor_pagination'>
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className='pagination_button'
                        >
                            Before
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`pagination_button ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="pagination_button"
                        >
                            After
                        </button>

                        <div className="pagination_info">
                            Page {currentPage} / {totalPages}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Product;