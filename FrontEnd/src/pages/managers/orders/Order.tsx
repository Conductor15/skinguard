import { useState, useEffect } from "react";
import axiosInstance from "../../../api/Axios";
import { OrderType } from "../../../types/Types";
import { SearchIcon, DeleteIcon, FixIcon } from "../../../assets/SVG/Svg";
import '../doctors/Doctor.css';
import './Order.css';

type PatientType = {
    _id: string;
    patient_id: string;
    fullName: string;
    email: string;
};

type SortField = keyof OrderType | '';
type SortOrder = 'increase' | 'decrease';

const sortableFields: { label: string, value: SortField }[] = [
  { label: "Order ID", value: "order_id" },
  { label: "Patient", value: "orderBy" },
  { label: "Date", value: "orderDate" },
  { label: "Total", value: "totalPay" },
  { label: "Status", value: "status" },
  { label: "Payment", value: "paymentStatus" },
  { label: "Method", value: "paymentMethod" }
];

// Generate unique Order ID
function getNextOrderId(orders: OrderType[]): string {
    const prefix = "ORD";
    const usedNumbers = orders
        .map(order => order.order_id)
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

const Order = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersData, setOrdersData] = useState<OrderType[]>([]);
    const [patients, setPatients] = useState<PatientType[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const itemsPerPage = 5;

    // Sort state
    const [sortField, setSortField] = useState<SortField>('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('increase');

    // Form states
    const [addForm, setAddForm] = useState<OrderType>({
        order_id: '',
        orderBy: '',
        orderDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        totalPay: 0,
        shippingAddress: '',
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        notes: ''
    });
    const [editForm, setEditForm] = useState<OrderType | null>(null);    useEffect(() => {
        fetchOrders();
        fetchPatients();
    }, []);    const fetchPatients = async () => {
        try {
            const res = await axiosInstance.get('/patient');
            const patientList: PatientType[] = res.data.map((pat: any) => ({
                _id: pat._id,
                patient_id: pat.patient_id,
                fullName: pat.fullName,
                email: pat.email,
            }));
            setPatients(patientList);
        } catch (error) {
            console.error('Failed to fetch patients:', error);
            setPatients([]);
        }
    };    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/order');
            console.log('Orders API response:', res.data); // Debug log
            const filtered = res.data.map((order: any) => ({
                _id: order._id,
                order_id: order.order_id,
                orderBy: order.orderBy,
                orderDate: order.orderDate,
                status: order.status,
                totalPay: order.totalPay,
                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                notes: order.notes,
                deleted: order.deleted
            }));
            setOrdersData(filtered);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrdersData([]);
        }
        setLoading(false);
    };// Filter and search
    const filteredOrders = ordersData.filter(order => {
        return (
            order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.totalPay?.toString().includes(searchTerm.toLowerCase())
        );
    });

    // Sort Logic
    const sortedOrders = [...filteredOrders].sort((a, b) => {
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
        return 0;
    });

    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = sortedOrders.slice(startIndex, endIndex);

    // Add Order
    const handleAddOrder = () => {
        const newId = getNextOrderId(ordersData);
        setAddForm({
            order_id: newId,
            orderBy: '',
            orderDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            totalPay: 0,
            shippingAddress: '',
            paymentMethod: 'COD',
            paymentStatus: 'pending',
            notes: ''
        });
        setShowAddForm(true);
    };

    const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "totalPay") {
            setAddForm(prev => ({ ...prev, totalPay: Number(value) }));
        } else {
            setAddForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.order_id || !addForm.orderBy || !addForm.shippingAddress) {
            alert('Order ID, Patient, and Shipping Address are required!');
            return;
        }
        try {
            await axiosInstance.post('/order', addForm);
            setShowAddForm(false);
            setAddForm({
                order_id: '',
                orderBy: '',
                orderDate: new Date().toISOString().split('T')[0],
                status: 'pending',
                totalPay: 0,
                shippingAddress: '',
                paymentMethod: 'COD',
                paymentStatus: 'pending',
                notes: ''
            });
            fetchOrders();
            alert('Order added successfully!');
        } catch (err: any) {
            alert('Add order failed!');
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setAddForm({
            order_id: '',
            orderBy: '',
            orderDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            totalPay: 0,
            shippingAddress: '',
            paymentMethod: 'COD',
            paymentStatus: 'pending',
            notes: ''
        });
    };

    // Edit Order
    const handleEditOrder = (orderID: string) => {
        const order = ordersData.find(ord => ord._id === orderID);
        if (order) {
            setEditForm(order);
            setShowEditForm(true);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!editForm) return;
        const { name, value } = e.target;
        if (name === "totalPay") {
            setEditForm({ ...editForm, totalPay: Number(value) });
        } else {
            setEditForm({ ...editForm, [name]: value });
        }
    };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm || !editForm._id) return;
        try {
            const dataToSend = {
                order_id: editForm.order_id,
                orderBy: editForm.orderBy,
                orderDate: editForm.orderDate,
                status: editForm.status,
                totalPay: editForm.totalPay,
                shippingAddress: editForm.shippingAddress,
                paymentMethod: editForm.paymentMethod,
                paymentStatus: editForm.paymentStatus,
                notes: editForm.notes
            };
            await axiosInstance.patch(`/order/${editForm._id}`, dataToSend);
            setShowEditForm(false);
            setEditForm(null);
            fetchOrders();
            alert('Order updated successfully!');
        } catch (err: any) {
            alert('Order update failed!');
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditForm(null);
    };

    // Delete Order
    const handleDeleteOrder = async (orderID: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axiosInstance.delete(`/order/${orderID}`);
                setOrdersData(prev => prev.filter(ord => ord._id !== orderID));
                alert('Order deleted successfully!');
            } catch (err: any) {
                alert('Delete order failed!');
            }
        }
    };    // Pagination handlers
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

    // Reset current page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortField, sortOrder]);

    // Sort control
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <span className='init_sort_icon_admin'>▲</span>;
        }
        if (sortOrder === "increase") {
            return <span className='active_sort_icon_admin'>▼</span>;
        }
        return <span className='active_sort_icon_admin'>▲</span>;
    };

    const handleHeaderClick = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === "increase" ? "decrease" : "increase");
        } else {
            setSortField(field);
            setSortOrder("increase");
        }
    };    // Format date function
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };    // Get patient name function
    const getPatientName = (orderBy: string) => {
        // Nếu orderBy đã có format "PAT002 - ductest11" (data cũ)
        if (orderBy && orderBy.includes(' - ')) {
            return orderBy;
        }
        
        // Nếu orderBy là ObjectId mới, tìm trong patients
        const patient = patients.find(p => p._id === orderBy);
        return patient ? `${patient.patient_id} - ${patient.fullName}` : orderBy || 'Unknown Patient';
    };

    return (
        <div className="doctor_container">
            {/* Header */}
            <div className="doctor_header">
                <div className="doctor_title">List of Orders</div>
                
                {/* Search and Add Button */}
                <div className="doctor_controls">
                    <div className="doctor_search_container">
                        <SearchIcon className="doctor_search_icon" />
                        <input
                            type="text"
                            placeholder="Find an order..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="doctor_search_input"
                        />
                    </div>
                    
                    <button
                        onClick={handleAddOrder}
                        className="doctor_add_button"
                    >
                        Add new order
                    </button>
                </div>
            </div>

            {/* Add Order Form */}
            {showAddForm && (
                <div className="doctor_add_form_overlay">
                    <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
                        <h3>Add New Order</h3>                        <input
                            name="order_id"
                            placeholder="Order ID"
                            value={addForm.order_id}
                            readOnly
                            required
                        />                        <select
                            name="orderBy"
                            title="Select Patient"
                            value={addForm.orderBy}
                            onChange={handleAddFormChange}
                            required
                        >                            <option value="">-- Select Patient --</option>
                            {patients.map((p, index) =>
                                <option key={`add-${p.patient_id}-${index}`} value={p._id}>
                                    {p.patient_id} - {p.fullName}
                                </option>
                            )}
                        </select><input
                            name="orderDate"
                            type="date"
                            title="Order Date"
                            value={addForm.orderDate}
                            onChange={handleAddFormChange}
                            required
                        />
                        <input
                            name="totalPay"
                            type="number"
                            placeholder="Total Payment"
                            value={addForm.totalPay}
                            onChange={handleAddFormChange}
                            required
                        />
                        <input
                            name="shippingAddress"
                            placeholder="Shipping Address"
                            value={addForm.shippingAddress}
                            onChange={handleAddFormChange}
                            required
                        />                        <select
                            name="status"
                            title="Order Status"
                            value={addForm.status}
                            onChange={handleAddFormChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>                        <select
                            name="paymentMethod"
                            title="Payment Method"
                            value={addForm.paymentMethod}
                            onChange={handleAddFormChange}
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                        <select
                            name="paymentStatus"
                            title="Payment Status"
                            value={addForm.paymentStatus}
                            onChange={handleAddFormChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        <textarea
                            name="notes"
                            placeholder="Notes (optional)"
                            value={addForm.notes}
                            onChange={handleAddFormChange}
                            rows={3}
                        />
                        <div className="doctor_add_form_buttons">
                            <button type="submit" className="doctor_add_button">Save</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelAdd}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Order Form */}
            {showEditForm && editForm && (
                <div className="doctor_add_form_overlay">
                    <form className="doctor_add_form" onSubmit={handleEditFormSubmit}>
                        <h3>Edit Order</h3>                        <input
                            name="order_id"
                            placeholder="Order ID"
                            value={editForm.order_id}
                            readOnly
                            required
                        />                        <select
                            name="orderBy"
                            title="Select Patient"
                            value={editForm.orderBy}
                            onChange={handleEditFormChange}
                            required
                        >                            <option value="">-- Select Patient --</option>
                            {patients.map((p, index) =>
                                <option key={`edit-${p.patient_id}-${index}`} value={p._id}>
                                    {p.patient_id} - {p.fullName}
                                </option>
                            )}
                        </select><input
                            name="orderDate"
                            type="date"
                            title="Order Date"
                            value={typeof editForm.orderDate === 'string' ? editForm.orderDate : ''}
                            onChange={handleEditFormChange}
                            required
                        />
                        <input
                            name="totalPay"
                            type="number"
                            placeholder="Total Payment"
                            value={editForm.totalPay}
                            onChange={handleEditFormChange}
                            required
                        />
                        <input
                            name="shippingAddress"
                            placeholder="Shipping Address"
                            value={editForm.shippingAddress}
                            onChange={handleEditFormChange}
                            required
                        />                        <select
                            name="status"
                            title="Order Status"
                            value={editForm.status}
                            onChange={handleEditFormChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select
                            name="paymentMethod"
                            title="Payment Method"
                            value={editForm.paymentMethod}
                            onChange={handleEditFormChange}
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                        <select
                            name="paymentStatus"
                            title="Payment Status"
                            value={editForm.paymentStatus}
                            onChange={handleEditFormChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        <textarea
                            name="notes"
                            placeholder="Notes (optional)"
                            value={editForm.notes || ''}
                            onChange={handleEditFormChange}
                            rows={3}
                        />
                        <div className="doctor_add_form_buttons">
                            <button type="submit" className="doctor_add_button">Save</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="doctor_table">
                {/* Table Header */}
                <div className="doctor_table_header">
                    <div className="doctor_table_header_grid">
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
                        <div>Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="doctor_table_body">
                    {loading ? (
                        <div className="doctor_no_results">Loading...</div>
                    ) : currentOrders.length > 0 ? (
                        currentOrders.map((order) => (
                            <div key={order._id} className="doctor_table_row">
                                <div className="doctor_table_row_grid">
                                    <div className="doctor_cell_id">
                                        {order.order_id}
                                    </div>
                                    <div className="doctor_cell_name">
                                        {getPatientName(order.orderBy)}
                                    </div>
                                    <div className="doctor_cell_text">
                                        {formatDate(order.orderDate)}
                                    </div>
                                    <div className="doctor_cell_text">
                                        ${order.totalPay}
                                    </div>
                                    <div className={`doctor_cell_text ${
                                        order.status === 'delivered' ? 'status-success' :
                                        order.status === 'cancelled' ? 'status-error' :
                                        order.status === 'shipped' ? 'status-warning' : 'status-pending'
                                    }`}>
                                        {order.status}
                                    </div>
                                    <div className={`doctor_cell_text ${
                                        order.paymentStatus === 'paid' ? 'status-success' :
                                        order.paymentStatus === 'failed' ? 'status-error' : 'status-pending'
                                    }`}>
                                        {order.paymentStatus}
                                    </div>
                                    <div className="doctor_cell_text">
                                        {order.paymentMethod}
                                    </div>
                                    <div className="doctor_actions">
                                        <button
                                            onClick={() => handleEditOrder(order._id!)}
                                            className="action_button edit_button"
                                            title="Edit Order"
                                        >
                                            <FixIcon className="action_icon" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order._id!)}
                                            className="action_button delete_button"
                                            title="Delete Order"
                                        >
                                            <DeleteIcon className="action_icon" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="doctor_no_results">
                            No orders found
                        </div>
                    )}
                </div>
            </div>

            {/* Summary and Pagination */}
            <div className="doctor_summary">
                <div>
                    Show {currentOrders.length} / {sortedOrders.length} orders
                </div>
                
                {totalPages > 1 && (
                    <div className="doctor_pagination">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="pagination_button"
                        >
                            Previous
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
                            Next
                        </button>
                        
                        <div className="pagination_info">
                            Page {currentPage} / {totalPages}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Order;