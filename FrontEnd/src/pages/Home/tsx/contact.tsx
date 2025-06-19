import '../css/contact.css'
import { PhoneIconBlue, LocationIconBlue, MailIconBlue, ClockIconBlue } from '../../../assets/SVG/Svg';

const Contact = () => {
    const contact_list = [
        {
            icon: (
                <PhoneIconBlue />
            ),
            text_1: "Emergency",
            text_2: "(237) 681-812-255",
            text_3: "(237) 666-331-894"
        },
        {
            icon: (
                <LocationIconBlue />
            ),
            text_1: "Location",
            text_2: "KTX khu B",
            text_3: "Dĩ An - Bình Dương"
        },       
        {
            icon: (
                <MailIconBlue />
            ),
            text_1: "Email",
            text_2: "haha@example.com",
            text_3: "techwwiq@example.com"
        },
        {
            icon: (
                <ClockIconBlue />
            ),
            text_1: "Working Hours",
            text_2: "Mon-Sat 09:00-20:00",
            text_3: "Sunday Emergency only"
        }
    ];

    return (
        <div className='contact'>
            <span className='contact_first'>Get in touch</span>
            <span className='contact_second'>Contact</span>
            <div className='contact_list'>
                {contact_list.map((contact, idx) => (
                    <div className={`${idx % 2 === 1 ? 'contact_item_next_1' : 'contact_item_next_2'}`} key={idx}>
                        <div className='contact_item_icon'>
                            {contact.icon}
                        </div>
                        <div className='contact_item_text'>
                            <span className='contact_item_text_1'>{contact.text_1}</span>
                            <span className='contact_item_text_2'>{contact.text_2}</span>
                            <span className='contact_item_text_3'>{contact.text_3}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Contact