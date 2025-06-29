import { useState, useEffect } from "react";
import axiosInstance from "../../../api/Axios";
import { OrderWithDetailsType, OrderDetailType, ProductType } from "../../../types/Types";
import { SearchIcon, DeleteIcon, FixIcon } from "../../../assets/SVG/Svg";
import '../doctors/Doctor.css';
import './Order.css';

const OrderWithDetails = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersData, setOrdersData] = useState<OrderWithDetailsType[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetailsType | null>(null);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchOrdersWithDetails();
    }, []);

    const fetchOrdersWithDetails = () => {
        setLoading(true);
        axiosInstance.get('/order/with-details')
            .then((res) => {
                const filtered = res.data.map((order: any) => ({
                    _id: order._id,
                    order_id: order.order_id,
                    orderBy: typeof order.orderBy === 'object' ? order.orderBy.fullName || order.orderBy._id : order.orderBy,
                    orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : '',
                    status: order.status,
                    totalPay: order.totalPay,
                    shippingAddress: order.shippingAddress,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    notes: order.notes,
                    deleted: order.deleted,
                    orderDetails: order.orderDetails || []
                }));
                setOrdersData(filtered);
                setLoading(false);
            })
            .catch(() => {
                setOrdersData([]);
                setLoading(false);
            });
    };

    // Filter and search
    const filteredOrders = ordersData.filter(order => {
        return (
            order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof order.orderBy === 'string' ? order.orderBy.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
            order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.totalPay?.toString().includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    // View order details
    const handleViewDetails = (order: OrderWithDetailsType) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
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
    };

    // Pagination handlers
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
    }, [searchTerm]);

    // Format date function
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };    // Get patient name
    const getPatientName = (orderBy: string | any) => {
        if (typeof orderBy === 'object') return orderBy.fullName || orderBy._id;
        return orderBy || 'Unknown Patient';
    };

    // Calculate total products in order
    const getTotalProducts = (orderDetails: OrderDetailType[]) => {
        return orderDetails.reduce((total, detail) => total + detail.quantity, 0);
    };

    return (
        <div className="doctor_container">
            {/* Header */}
            <div className="doctor_header">
                <div className="doctor_title">Orders with Product Details</div>
                
                {/* Search */}
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
                </div>
            </div>

            {/* Table */}
            <div className="doctor_table">
                {/* Table Header */}
                <div className="doctor_table_header">
                    <div className="order_with_details_header_grid">
                        <div>Order ID</div>
                        <div>Patient</div>
                        <div>Date</div>
                        <div>Products Count</div>
                        <div>Total</div>
                        <div>Status</div>
                        <div>Payment</div>
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
                                <div className="order_with_details_row_grid">
                                    <div className="doctor_cell_id">
                                        {order.order_id}
                                    </div>                                    <div className="doctor_cell_name">
                                        {getPatientName(order.orderBy)}
                                    </div>
                                    <div className="doctor_cell_text">
                                        {formatDate(order.orderDate)}
                                    </div>
                                    <div className="doctor_cell_text">
                                        {getTotalProducts(order.orderDetails || [])} items
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
                                    <div className="doctor_actions">                                        <button
                                            onClick={() => handleViewDetails(order)}
                                            className="action_button view_button"
                                            title="View Products"
                                        >
                                            👁️
                                            View
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

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="doctor_add_form_overlay">
                    <div className="order_details_modal">
                        <div className="order_details_header">
                            <h3>Order Details - {selectedOrder.order_id}</h3>
                            <button 
                                className="modal_close_button"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="order_details_info">
                            <div className="order_info_grid">
                                <div><strong>Patient:</strong> {getPatientName(selectedOrder.orderBy)}</div>
                                <div><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</div>
                                <div><strong>Status:</strong> {selectedOrder.status}</div>
                                <div><strong>Payment:</strong> {selectedOrder.paymentStatus}</div>
                                <div><strong>Method:</strong> {selectedOrder.paymentMethod}</div>
                                <div><strong>Address:</strong> {selectedOrder.shippingAddress}</div>
                            </div>
                        </div>

                        <div className="order_products_section">
                            <h4>Products Ordered:</h4>
                            <div className="order_products_list">
                                {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 ? (
                                    selectedOrder.orderDetails.map((detail, index) => (
                                        <div key={index} className="order_product_item">
                                            <div className="product_info">
                                                {typeof detail.productID === 'object' ? (
                                                    <>
                                                        <div className="product_name">{detail.productID.title}</div>
                                                        <div className="product_description">{detail.productID.description}</div>
                                                    </>
                                                ) : (
                                                    <div className="product_name">Product ID: {detail.productID}</div>
                                                )}
                                            </div>
                                            <div className="product_details">
                                                <span>Qty: {detail.quantity}</span>
                                                <span>Price: ${detail.price}</span>
                                                <span>Subtotal: ${detail.subtotal}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no_products">No products in this order</div>
                                )}
                            </div>
                        </div>

                        <div className="order_total_section">
                            <div className="order_total">
                                <strong>Total: ${selectedOrder.totalPay}</strong>
                            </div>
                        </div>

                        {selectedOrder.notes && (
                            <div className="order_notes_section">
                                <h4>Notes:</h4>
                                <p>{selectedOrder.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Summary and Pagination */}
            <div className="doctor_summary">
                <div>
                    Show {currentOrders.length} / {filteredOrders.length} orders
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

export default OrderWithDetails;
