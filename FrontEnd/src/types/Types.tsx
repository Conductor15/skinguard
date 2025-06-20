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
    email: string;
    password: string;
    specialty: string;
    phone: string;
    avatar: string;
    rating: number;
    status: string;
    experienceYears: number;
}

// Patient
export type PatientType = {
    _id?: string;
    patient_id: string;
    fullName: string;
    email: string;
    password: string;
    phone: string;
    avatar: string;
    status: string;
};
  