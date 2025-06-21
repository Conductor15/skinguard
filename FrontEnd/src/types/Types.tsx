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