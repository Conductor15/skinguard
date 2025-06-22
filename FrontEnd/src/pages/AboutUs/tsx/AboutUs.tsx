import '../css/AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us-container fade-in">
            <h2>Giới thiệu về Skinguard</h2>
            <p>
                <strong>Skinguard</strong> là một nền tảng web ứng dụng trí tuệ nhân tạo trong lĩnh vực chăm sóc da liễu,
                cho phép người dùng chẩn đoán các bệnh ngoài da một cách nhanh chóng và chính xác thông qua hình ảnh.
            </p>
            <p>
                Hệ thống sử dụng mô hình học sâu được huấn luyện trên tập dữ liệu y khoa chuẩn quốc tế <strong>HAM10000</strong> – 
                một trong những tập dữ liệu lớn nhất và uy tín nhất trong lĩnh vực da liễu.
            </p>
            <p>
                Ngoài chức năng chẩn đoán bệnh, Skinguard còn mang đến hệ sinh thái chăm sóc sức khỏe toàn diện:
            </p>
            <ul>
                <li>💊 Đề xuất sản phẩm điều trị phù hợp với từng loại bệnh</li>
                <li>👩‍⚕️ Đặt lịch tư vấn trực tuyến với bác sĩ da liễu</li>
                <li>📋 Hồ sơ y tế cá nhân giúp theo dõi quá trình điều trị</li>
                <li>🔒 Bảo mật thông tin người dùng và lịch sử khám bệnh</li>
            </ul>

            <h3>Các bệnh da liễu được hỗ trợ</h3>
            <ul className="disease-list">
                <li><strong>Melanoma (mel)</strong>: Ung thư hắc tố da – nguy hiểm, cần phát hiện sớm.</li>
                <li><strong>Melanocytic Nevi (nv)</strong>: Nốt ruồi – lành tính, phổ biến.</li>
                <li><strong>Basal Cell Carcinoma (bcc)</strong>: Ung thư biểu mô tế bào đáy – thường gặp, điều trị được.</li>
                <li><strong>Actinic Keratoses (akiec)</strong>: Tổn thương tiền ung thư do nắng – nên điều trị sớm.</li>
                <li><strong>Benign Keratosis (bkl)</strong>: Tổn thương sừng lành tính.</li>
                <li><strong>Dermatofibroma (df)</strong>: U xơ da – lành tính.</li>
                <li><strong>Vascular lesions (vasc)</strong>: Tổn thương mạch máu như u máu.</li>
            </ul>

            <h3>Hướng dẫn sử dụng</h3>
            <ol>
                <li>📷 Tải lên hình ảnh vùng da nghi ngờ bị bệnh qua giao diện chẩn đoán</li>
                <li>🧠 Hệ thống AI sẽ phân tích và trả kết quả chẩn đoán tức thì</li>
                <li>💊 Nhận đề xuất thuốc điều trị phù hợp từ hệ thống</li>
                <li>📆 Nếu cần, đặt lịch tư vấn với bác sĩ chuyên khoa</li>
                <li>🗂 Lưu lại kết quả để theo dõi tiến trình điều trị trong hồ sơ cá nhân</li>
            </ol>

            <p>
                Skinguard cam kết hỗ trợ cộng đồng trong việc tiếp cận các giải pháp y tế hiện đại và tiện lợi.
                Chúng tôi tin rằng công nghệ sẽ tạo nên sự thay đổi tích cực trong cuộc sống mỗi người.
            </p>
            <p>
                Mọi thông tin cá nhân được bảo mật tuyệt đối theo tiêu chuẩn quốc tế. Trải nghiệm Skinguard ngay hôm nay để bảo vệ làn da và sức khỏe của bạn!
            </p>
        </div>
    );
};

export default AboutUs;
