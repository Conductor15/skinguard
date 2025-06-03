import Diagnose from "../../../assets/pictures/diagnose.png";

import "./Diagnose_Manager.css";

const Diagnose_Manager = () => {

    const diagnose_table = [
        {
            ID: "ID",
            Lesion_Image: "Lesion Image",
            Diagnose_Type: "Diagnose Type",
            Date_Diagnosed: "Date Diagnosed",
            Confidence_Level: "Confidence Level",
            Rating: "Rating"
        },
        {
            ID: "1",
            Lesion_Image: <img src={Diagnose} />,
            Diagnose_Type: "Type A",
            Date_Diagnosed: "2023-10-01",
            Confidence_Level: "High",
            Rating: "5"
        },
        {
            ID: "2",
            Lesion_Image: <img src={Diagnose} />,
            Diagnose_Type: "Type B",
            Date_Diagnosed: "2023-10-02",
            Confidence_Level: "Medium",
            Rating: "4"
        },
        {
            ID: "3",
            Lesion_Image: <img src={Diagnose} />,
            Diagnose_Type: "Type C",
            Date_Diagnosed: "2023-10-03",
            Confidence_Level: "Low",
            Rating: "3"
        },
        {
            ID: "4",
            Lesion_Image: <img src={Diagnose} />,
            Diagnose_Type: "Type D",
            Date_Diagnosed: "2023-10-04",
            Confidence_Level: "High",
            Rating: "5"
        },
        {
            ID: "5",
            Lesion_Image: <img src={Diagnose} />,
            Diagnose_Type: "Type E",
            Date_Diagnosed: "2023-10-05",
            Confidence_Level: "Medium",
            Rating: "4"
        }
    ]

    return (
        <div className="diagnose_manager">
            {/* <Slidebar /> */}
            <div className="diagnose_manager_content">
                {/* <MainDashBoardHeader /> */}
                <span className="diagnose_manager_span">Dianosis List</span>
                <div className="diagnose_manager_filter">
                    {/* 1 */}
                    <div className="diagnose_manager_leision">
                        <div className="diagnose_manager_leision_box">
                                Seilect leision
                        </div>
                        <div className="diagnose_manager_leision_box_button">

                        </div>
                    </div>
                    {/* 2 */}
                    <div className="diagnose_manager_leision">
                        <div className="diagnose_manager_leision_box">
                                Seilect leision
                        </div>
                        <div className="diagnose_manager_leision_box_button">

                        </div>  
                    </div>
                    {/* 3 */}
                    <div className="diagnose_manager_export">Export</div>
                    <input type="text" className="diagnose_manager_input"/>
                    <button className="diagnose_manager_button">Search</button>
                </div>

                <div className="diagnose_manager_list">
                    <div className="diagnose_manager_list_header">
                        {diagnose_table.map((item, idx) => {
                            if (idx === 0) {
                                return (
                                    <>
                                        <div className="diagnose_manager_list_header_text">{item.ID}</div>
                                        <div className="diagnose_manager_list_header_text">{item.Lesion_Image}</div>
                                        <div className="diagnose_manager_list_header_text">{item.Diagnose_Type}</div>
                                        <div className="diagnose_manager_list_header_text">{item.Date_Diagnosed}</div>
                                        <div className="diagnose_manager_list_header_text">{item.Confidence_Level}</div>
                                        <div className="diagnose_manager_list_header_text">{item.Rating}</div>
                                    </>
                                );
                            }
                        })}
                    </div>
                    {diagnose_table.map((item, idx) => (
                        idx !== 0 ? (
                            <div className="diagnose_manager_list_body">
                                <div className="diagnose_manager_list_header_text">{item.ID}</div>
                                <div className="diagnose_manager_list_header_text">{item.Lesion_Image}</div>
                                <div className="diagnose_manager_list_header_text">{item.Diagnose_Type}</div>
                                <div className="diagnose_manager_list_header_text">{item.Date_Diagnosed}</div>
                                <div className="diagnose_manager_list_header_text">{item.Confidence_Level}</div>
                                <div className="diagnose_manager_list_header_text">{item.Rating}</div>
                            </div>
                        ) : null
                    ))}
                </div>

                <div className="diagnose_manager_pagination">
                    <div className="diagnose_manager_pagination_button">Previous</div>
                    <div className="diagnose_manager_pagination_number">4</div>
                    <div className="diagnose_manager_pagination_number">5</div>
                    <div className="diagnose_manager_pagination_number">...</div>
                    <div className="diagnose_manager_pagination_number">18</div>
                    <div className="diagnose_manager_pagination_button">Next</div>
                </div>
            </div>
        </div>
    );
};

export default Diagnose_Manager