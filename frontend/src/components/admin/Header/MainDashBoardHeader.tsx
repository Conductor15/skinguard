import "./MainDashBoardHeader.css"
import Avatar from '../../../assets/pictures/avatar.jpg'

const MainDashBoardHeader = () => {
    return (
        <div className='Main_Dashboard_header'>
                <div className='Main_Dashboard_look_up'>
                    <svg viewBox="0 0 1024.00 1024.00" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="25.6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M460 459.3m-245.2 0a245.2 245.2 0 1 0 490.4 0 245.2 245.2 0 1 0-490.4 0Z" fill="#FFFFFF"></path><path d="M460 719c-69.4 0-134.6-27-183.6-76.1s-76.1-114.3-76.1-183.6c0-69.4 27-134.6 76.1-183.6s114.3-76.1 183.6-76.1c69.4 0 134.6 27 183.6 76.1s76.1 114.3 76.1 183.6c0 69.4-27 134.6-76.1 183.6S529.4 719 460 719z m0-490.4c-61.6 0-119.6 24-163.1 67.6-43.6 43.6-67.6 101.5-67.6 163.1s24 119.6 67.6 163.1C340.4 666 398.4 690 460 690s119.6-24 163.1-67.6c43.6-43.6 67.6-101.5 67.6-163.1s-24-119.6-67.6-163.1c-43.5-43.6-101.5-67.6-163.1-67.6z" fill="#000000"></path><path d="M640.6 630.6c8.7-8.7 22.8-8.7 31.5 0L802 760.5c8.6 8.9 8.3 23-0.5 31.5-8.6 8.3-22.3 8.3-31 0L640.6 662.1c-8.4-8.6-8.1-22.6 0-31.5z" fill="#000000"></path></g></svg>
                    <input type="text" placeholder="Search" />
                </div>
                <div className='Main_Dashboard_info'>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="0" fill="none" width="24" height="24"></rect> <g> <path d="M20 4H4c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 4.236l-8 4.882-8-4.882V6h16v2.236z"></path> </g> </g></svg>
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 5C3 2.23858 5.23858 0 8 0C10.7614 0 13 2.23858 13 5V8L15 10V12H1V10L3 8V5Z" fill="#000000"></path> <path d="M7.99999 16C6.69378 16 5.58254 15.1652 5.1707 14H10.8293C10.4175 15.1652 9.30621 16 7.99999 16Z" fill="#000000"></path> </g></svg>
                    <img src={Avatar} alt="avatar" />
                    <span>Hi, Bro</span>
                </div>
            </div>
    )
}

export default MainDashBoardHeader