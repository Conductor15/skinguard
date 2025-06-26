import { useState, useEffect, ChangeEvent } from 'react';
import axiosInstance from '../../../api/Axios';
import { ProductType } from '../../../types/Types';
import { SearchIcon, DeleteIcon, FixIcon } from '../../../assets/SVG/Svg';
import '../doctors/Doctor.css';
import './Product.css';

type SortField = keyof ProductType | '';
type SortOrder = 'increase' | 'decrease';

const sortableFields: { label: string, value: SortField }[] = [
  { label: "ID", value: "product_id" },
  { label: "Title", value: "title" },
  { label: "Description", value: "description" },
  { label: "Image", value: "image" },
  { label: "Price", value: "price" },
  { label: "Sold Count", value: "sold_count" },
  { label: "Availability", value: "availability" }
];

// Generate a unique ID for a new product
function getNextProductId(products: ProductType[]): string {
    const prefix = "PROD";
    const usedNumbers = products
        .map(pro => pro.product_id)
        .filter(id => id && id.startsWith(prefix))
        .map(id => parseInt(id.replace(prefix, ""), 10))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    let nextNum = 1;
    for (let num of usedNumbers) {
        if (num === nextNum) nextNum++;
        else break;
    }
    return prefix + nextNum.toString().padStart(3, "0");
}

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

    const [selectedLeision, setSelectedLeision] = useState('nv');


    const itemsPerPage = 5;

    // Image upload
    const [addImageUploading, setAddImageUploading] = useState(false);
    const [editImageUploading, setEditImageUploading] = useState(false);

    // Sort state
    const [sortField, setSortField] = useState<SortField>('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('increase');

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

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            if (sortOrder === 'increase') return aVal.localeCompare(bVal);
            else return bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            if (sortOrder === 'increase') return aVal - bVal;
            else return bVal - aVal;
        }
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
            if (sortOrder === 'increase') return (aVal === bVal ? 0 : aVal ? 1 : -1);
            else return (aVal === bVal ? 0 : aVal ? -1 : 1);
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    // Add Product
    const handleAddProduct = () => {
        const newId = getNextProductId(productsData);
        setAddForm({
            product_id: newId,
            title: '',
            description: '',
            price: 0,
            sold_count: 0,
            availability: true,
            image: '',
        });
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

    // Upload image for add form
    const handleAddImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAddImageUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            // upload to backend
            const res = await axiosInstance.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAddForm(prev => ({ ...prev, image: res.data.url }));
        } catch (err) {
            alert('Upload image failed!');
        }
        setAddImageUploading(false);
    };

    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.product_id || addForm.product_id.trim() === '') {
            alert('Product ID is required!');
            return;
        }
        if (!addForm.image) {
            alert('Please upload product image!');
            return;
        }

        const productIdToAdd = addForm.product_id;

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
            alert('Product added successfully!');
        } catch (err: any) {
            alert('Add failed product!');
        }


        try {
             const res = await axiosInstance.get(`/skin-leision/${selectedLeision}`);
            const currentLeision = res.data;

            // 2. Thêm productId nếu chưa có
            const updatedProducts = currentLeision.relatedProducts || [];

            if (!updatedProducts.includes(productIdToAdd)) {
                updatedProducts.push(productIdToAdd);
            }

            // 3. Gửi PATCH toàn bộ lại
            await axiosInstance.patch(`/skin-leision/${selectedLeision}`, {
                relatedProducts: updatedProducts
            });
        
        } catch (err: any) {
            alert('Add failed product to leision table!');
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

    // Upload image for edit form
    const handleEditImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        const file = e.target.files?.[0];
        if (!file) return;
        setEditImageUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axiosInstance.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditForm(prev => prev ? { ...prev, image: res.data.url } : null);
        } catch (err) {
            alert('Upload image failed!');
        }
        setEditImageUploading(false);
    };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!editForm || !editForm._id) return;
        if (!editForm.product_id || editForm.product_id.trim() === '') {
            alert('Product ID is required!');
            return;
        }
        if (!editForm.image) {
            alert('Please upload product image!');
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
            alert('Product update successful!');
        } catch (err: any) {
            if (err?.response?.data?.message) {
                alert(err.response.data.message);
            }
            else {
                alert('Product update failed!');
            }
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditForm(null);
    };

    // Delete product
    const handleDeleteProduct = async (productID: string) => {
        if (window.confirm('Are you sure you want to delete this product??')) {
            try {
                await axiosInstance.delete(`/product/${productID}`);
                setProductsData(prev => prev.filter(pro => pro._id !== productID));
                alert('Product deleted successfully!');
            } catch (err: any) {
                alert('Delete product failed!');
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
    }, [searchTerm, sortField, sortOrder]);

    // Sort control
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return (
                <span className='init_sort_icon_admin'>▲</span>
            );
        }
        if (sortOrder === "increase") {
            return (
                <span className='active_sort_icon_admin'>▼</span>
            );
        }
        return (
            <span className='active_sort_icon_admin'>▲</span>
        );
    };

    const handleHeaderClick = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === "increase" ? "decrease" : "increase");
        } else {
            setSortField(field);
            setSortOrder("increase");
        }
    };

    return (
        <div className='doctor_container'>
            {/* header */}
            <div className='doctor_header'>
                <div className='doctor_title'>List of products</div>
                <div className='doctor_controls'>
                    {/* Search */}
                    <div className="doctor_search_container">
                        <SearchIcon className="doctor_search_icon" />
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
                        <input
                            name="product_id"
                            placeholder="Product ID"
                            value={addForm.product_id}
                            readOnly
                            required
                        />
                        <input name="title" placeholder="Title" value={addForm.title} onChange={handleAddFormChange} required />
                        <input name="description" placeholder="Description" value={addForm.description} onChange={handleAddFormChange} required />
                        <label htmlFor="price">Price</label>
                        <input name="price" type="number" placeholder="Price" value={addForm.price} onChange={handleAddFormChange} required />
                        <label htmlFor="sold_count">sold count</label>
                        <input name="sold_count" type="number" placeholder="Sold Count" value={addForm.sold_count} onChange={handleAddFormChange} />
                        <label htmlFor="availability">availability</label>
                        <select name="availability" value={addForm.availability ? "true" : "false"} onChange={handleAddFormChange} required>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        {/* Image upload */}
                        <div style={{ marginBottom: 8 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAddImageFileChange}
                                disabled={addImageUploading}
                            />
                            {addImageUploading && <span>Uploading...</span>}
                        </div>
                        {/* Show preview */}
                        {addForm.image && <img src={addForm.image} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #eee', borderRadius: 4 }} />}

                       <label htmlFor="leision">Leision</label>
                        <select
                            name="leision"
                            value={selectedLeision}
                            onChange={(e) => setSelectedLeision(e.target.value)}
                            required
                        >
                            <option value="akiec">Actinic Keratoses (akiec)</option>
                            <option value="bcc">Basal Cell Carcinoma (bcc)</option>
                            <option value="bkl">Benign Keratosis-like Lesions (bkl)</option>
                            <option value="df">Dermatofibroma (df)</option>
                            <option value="mel">Melanoma (mel)</option>
                            <option value="nv">Melanocytic Nevi (nv)</option>
                            <option value="vasc">Vascular Lesions (vasc)</option>
                        </select>


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
                        <h3>Product updates</h3>
                        <input name="product_id" placeholder="Product ID" value={editForm.product_id} readOnly required />
                        <input name="title" placeholder="Title" value={editForm.title} onChange={handleEditFormChange} required />
                        <input name="description" placeholder="Description" value={editForm.description} onChange={handleEditFormChange} required />
                        <input name="price" type="number" placeholder="Price" value={editForm.price} onChange={handleEditFormChange} required />
                        <input name="sold_count" type="number" placeholder="Sold Count" value={editForm.sold_count} onChange={handleEditFormChange} />
                        <select name="availability" value={editForm.availability ? "true" : "false"} onChange={handleEditFormChange} required>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <div style={{ marginBottom: 8 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageFileChange}
                                disabled={editImageUploading}
                            />
                            {editImageUploading && <span>Uploading...</span>}
                        </div>
                        {/* Show preview */}
                        {editForm.image && <img src={editForm.image} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #eee', borderRadius: 4 }} />}
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
                        {sortableFields.map(field => (
                            <div
                                key={field.value}
                                className='header_table_admin'
                                onClick={() => handleHeaderClick(field.value)}
                            >
                                {field.label}
                                {renderSortIcon(field.value)}
                            </div>
                        ))}
                        <div>Operation</div>
                    </div>
                </div>
                {/* Table Body */}
                <div className="doctor_table_body">
                    {loading ? (
                        <div className="doctor_no_results">Loading...</div>
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
                                            <FixIcon className="action_icon" />
                                            Fix
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id!)}
                                            className="action_button delete_button"
                                            title="Delete Product"
                                        >
                                            <DeleteIcon className="action_icon" />
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
                    Show {currentProducts.length} / {sortedProducts.length} products
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