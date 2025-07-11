import Chart from '../../../assets/pictures/chart.png'
import axiosInstance from '../../../api/Axios';
import { useEffect, useState } from 'react';
import "./Dashboard.css";
import { ConsultType } from '../../../types/Types';

const Dashboard = () => {
    type DiagnoseType = {};

    const [loading, setLoading] = useState(false);
    const [diagnoseCount, setDiagnoseCount] = useState(0);
    const [consultCount, setConsultCount] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const diagnosesRes = await axiosInstance.get('/diagnose');
                const diagnoseList: DiagnoseType[] = diagnosesRes.data
                setDiagnoseCount(diagnoseList.length);

                const consultsRes = await axiosInstance.get('/consult');
                const consultList: ConsultType[] = consultsRes.data;
                setConsultCount(consultList.length);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const Metric = [
        {
            icon: (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 14C2 10.2288 2 8.34315 3.17157 7.17157C4.34315 6 6.22876 6 10 6H14C17.7712 6 19.6569 6 20.8284 7.17157C22 8.34315 22 10.2288 22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14Z" stroke="#000000" strokeWidth="1.5"></path> <path opacity="0.5" d="M16 6C16 4.11438 16 3.17157 15.4142 2.58579C14.8284 2 13.8856 2 12 2C10.1144 2 9.17157 2 8.58579 2.58579C8 3.17157 8 4.11438 8 6" stroke="#000000" strokeWidth="1.5"></path> <path d="M13.5 14H10.5M12 12.5V15.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path> <circle opacity="0.5" cx="12" cy="14" r="4" stroke="#000000" strokeWidth="1.5"></circle> </g></svg>),
            name: "Total Diagnoses",
            number: loading ? "..." : diagnoseCount.toLocaleString()
        },
        {
            icon: (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M9 14.2354V17.0001C9 19.7615 11.2386 22.0001 14 22.0001H14.8824C16.7691 22.0001 18.3595 20.7311 18.8465 19.0001" stroke="#000000" strokeWidth="1.5"></path> <path d="M5.42857 3H5.3369C5.02404 3 4.86761 3 4.73574 3.01166C3.28763 3.13972 2.13972 4.28763 2.01166 5.73574C2 5.86761 2 6.02404 2 6.3369V7.23529C2 11.1013 5.13401 14.2353 9 14.2353C12.7082 14.2353 15.7143 11.2292 15.7143 7.521V6.3369C15.7143 6.02404 15.7143 5.86761 15.7026 5.73574C15.5746 4.28763 14.4267 3.13972 12.9785 3.01166C12.8467 3 12.6902 3 12.3774 3H12.2857" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path> <circle cx="19" cy="16" r="3" stroke="#000000" strokeWidth="1.5"></circle> <path d="M12 2V4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6 2V4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>),
            name: "Pending Appointments",
            number: loading ? "..." : consultCount.toLocaleString()
        },
        {
            icon: (<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cart-shopping-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M44.3,10A3.3,3.3,0,0,0,42,9H11.5l-.4-3.4A3,3,0,0,0,8.1,3H5A2,2,0,0,0,5,7H7.2l3.2,26.9A5.9,5.9,0,0,0,7.5,39a6,6,0,0,0,6,6,6.2,6.2,0,0,0,5.7-4H29.8a6.2,6.2,0,0,0,5.7,4,6,6,0,0,0,0-12,6.2,6.2,0,0,0-5.7,4H19.2a6,6,0,0,0-4.9-3.9L14.1,31H39.4a3,3,0,0,0,2.9-2.6L45,12.6A3.6,3.6,0,0,0,44.3,10ZM37.5,39a2,2,0,1,1-2-2A2,2,0,0,1,37.5,39Zm-22,0a2,2,0,1,1-2-2A2,2,0,0,1,15.5,39Z"></path> </g> </g> </g></svg>),
            name: "New Orders",
            number: "5"
        },
        {
            icon: (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 2C1 1.44772 1.44772 1 2 1C2.55228 1 3 1.44772 3 2V20C3 20.5523 3.44771 21 4 21L22 21C22.5523 21 23 21.4477 23 22C23 22.5523 22.5523 23 22 23H3C1.89543 23 1 22.1046 1 21V2Z" fill="#0F0F0F"></path> <path d="M19.9285 5.37139C20.1336 4.85861 19.8842 4.27664 19.3714 4.07152C18.8586 3.86641 18.2766 4.11583 18.0715 4.62861L14.8224 12.7513C14.6978 13.0628 14.3078 13.1656 14.0459 12.9561L11.0811 10.5843C10.3619 10.0089 9.29874 10.2116 8.84174 11.0114L5.13176 17.5039C4.85775 17.9834 5.02434 18.5942 5.50386 18.8682C5.98338 19.1423 6.59423 18.9757 6.86824 18.4961L9.9982 13.0187C10.1505 12.7521 10.5049 12.6846 10.7447 12.8764L13.849 15.3598C14.635 15.9886 15.805 15.6802 16.1788 14.7456L19.9285 5.37139Z" fill="#0F0F0F"></path> </g></svg>),
            name: "Revenue",
            number: "1,500 $"
        }
    ];

    return (
        <div className="Main_Dashboard">
            <div className='Main_Dashboard_content'>
                <div className='Main_Dashboard_content_div'>Overview Metrics</div>
                <div className='Main_Dashboard_metrics'>
                    {Metric.map((metric, index) => (
                        <div className='Main_Dashboard_metric' key={index}>
                            <div className='Main_Dashboard_metric_icon'>
                                {metric.icon}
                            </div>
                            <div className='Main_Dashboard_metric_info'>
                                <span>{metric.name}</span>
                                <span>{metric.number}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='Main_Dashboard_content_div'>Analytics Charts</div>
                <div className='Main_Dashboard_Charts'>
                    <div className='Main_Dashboard_Charts_left'>
                        <div className='Main_Dashboard_Charts_left_header'>
                            <div>Diagnose Chart</div>
                            <div className='Main_Dashboard_Charts_left_header_button'>
                                <button className='Main_Dashboard_Charts_left_header_button_export'>Export</button>
                                <button className='Main_Dashboard_Charts_left_header_button_print'>Print</button>
                            </div>
                        </div>
                        <div className='Main_Dashboard_Charts_left_header_button_line'></div>
                        <img src={Chart} alt="chart" />
                        <div className='Main_Dashboard_Charts_left_header_end'>
                            <div className='Main_Dashboard_Charts_left_header_end_red'></div>
                            <div className='Main_Dashboard_Charts_left_header_end_div'>Cancerous Lesions</div>
                            <div className='Main_Dashboard_Charts_left_header_end_yellow'></div>
                            <div className='Main_Dashboard_Charts_left_header_end_div'>Pre-cancerous Lesions</div>
                            <div className='Main_Dashboard_Charts_left_header_end_blue'></div>
                            <div className='Main_Dashboard_Charts_left_header_end_div'>Non-cancerous Lesions</div>
                        </div>
                    </div>
                    <div className='Main_Dashboard_Charts_right'>
                        <div className='Main_Dashboard_Charts_right_Sale'>
                            <div className='Main_Dashboard_Charts_right_Sale_Name'>Daily Sales</div>
                            <div className='Main_Dashboard_Charts_right_Sale_date'>April 5 - May 3</div>
                            <div className='Main_Dashboard_Charts_right_Sale_money'>$4,578.58</div>
                        </div>
                        <div className='Main_Dashboard_Charts_right_user'>
                            <div className='Main_Dashboard_Charts_right_user_first'>
                                <div className='Main_Dashboard_Charts_right_user_number_users'>17</div>
                                <div className='Main_Dashboard_Charts_right_user_per'>+5%</div>
                            </div>
                            <div className='Main_Dashboard_Charts_right_user_second'>Users online</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;