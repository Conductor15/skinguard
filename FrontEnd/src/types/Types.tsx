// Product
export type ProductType = {
    _id?: string;
    product_id: string;
    title: string;
    description: string;
    price: number;
    sold_count: number;
    availability: boolean;
    image: string;
}

// Doctor
export type DoctorType = {
    _id?: string;
    doctor_id: string;
    fullName: string;
    email?: string;
    password?: string;
    discipline?: string;            
    phoneNumber?: string;           
    avatar?: string;
    rating?: number;
    status?: string;
    experienceYears?: number;
    consult_list_id?: string[];
}

// Patient
export type PatientType = {
    _id?: string;
    patient_id?: string;
    fullName: string;
    email?: string;
    password?: string;
    phone?: string;
    avatar?: string;
    status?: string;
    consult_list_id?: string[];
    birthDay?: string;
};

// Consult
export type ConsultType = {
    _id: string;
    consult_id: string;
    date: string;
    doctor_id: string | { _id: string };
    patient_id: string | { _id: string };
    patient_description: string;
    result: string;
};
  
// OrderDetail
export type OrderDetailType = {
    _id?: string;
    order_detail_id: string;
    orderID: string; // Order reference
    productID: string | ProductType; // Product reference or populated product
    quantity: number;
    price: number;
    subtotal: number;
    deleted?: boolean;
};

// Extended Order with Details
export type OrderWithDetailsType = {
    _id?: string;
    order_id: string;
    orderBy: string | PatientType; // Patient reference or populated patient
    orderDate: string;
    status: string;
    totalPay: number;
    shippingAddress: string;
    paymentMethod: string;
    paymentStatus: string;
    notes?: string;
    deleted?: boolean;
    orderDetails?: OrderDetailType[]; // Array of order details
};

// Order
export type OrderType = {
    _id?: string;
    order_id: string;
    orderBy: string; // Patient ID (simplified for form handling)
    orderDate: string; // Always string for form compatibility
    status: string; // pending, confirmed, shipped, delivered, cancelled
    totalPay: number;
    shippingAddress: string;
    paymentMethod: string; // COD, Card, Bank Transfer
    paymentStatus: string; // pending, paid, failed, refunded
    notes?: string;
    deleted?: boolean;
};
  
// Appointment 
export type AppointmentType = {
    consult_id: string;
    consult_db_id: string;
    date: string;
    doctor_id: string;
    doctor_name: string;
    patient_id: string;
    patient_name: string;
    patient_description: string;
    result: string;
};