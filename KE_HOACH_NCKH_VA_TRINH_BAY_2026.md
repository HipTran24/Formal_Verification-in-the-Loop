# Kế hoạch NCKH và chuẩn bị trình bày đề tài

**Đề tài:** Nghiên cứu khung sinh mã nguồn và tự sửa lỗi tự động dựa trên kiểm định logic hình thức (Formal Verification-in-the-Loop)  
**Mốc trình bày góp ý:** 19:00, Chủ Nhật 18/10/2026, trực tuyến qua Google Meet  
**Thời gian chuẩn bị trình bày:** 15–17/10/2026  
**Phạm vi tài liệu:** Kế hoạch nghiên cứu và chuẩn bị bảo vệ; không thay đổi mã nguồn.

---

## 1. Nhận xét và điều chỉnh từ bản Gemini

Bản Gemini hữu ích ở cấu trúc 5 yêu cầu, gợi ý 7 slide và cảnh báo giới hạn 5 phút. Tuy vậy, một số khẳng định cần sửa trước khi đưa vào slide hoặc hồ sơ NCKH:

| Khẳng định trong bản Gemini | Đối chiếu repo | Cách trình bày an toàn |
|---|---|---|
| “35 benchmark”, “113/113 tests”, “100% pass” | Repo có 35 tệp Dafny trong các nhóm Clover (6), HumanEval-Dafny (10) và Advanced (14) cộng Advanced Inductive (5). README lại mô tả bộ 30 bài. README badge ghi 46/46 tests; kế hoạch nội bộ ghi các mốc khác nhau đến 98/98. Không có bằng chứng trong tài liệu đã xem cho 113/113. | Gọi 35 là **tệp/bài toán hiện có** sau kiểm kê, nhưng phải xác định tập nào được chạy trong từng kết quả. Không nêu số test hiện hành trước khi chạy lại và lưu log có ngày, lệnh, môi trường. Không gộp test phần mềm với benchmark nghiên cứu. |
| “35 bài đã đạt 100%” | Kết quả cross-model mới nhất có 35 bài trong cấu hình nhưng GPT-OSS chỉ xử lý 29/35 và đạt 16/29; Qwen có 0 bài. Kết quả Clover riêng là 6 bài, hệ thống đạt 6/6 Pass@K còn baseline 5/6. | Báo cáo riêng từng lần chạy và mẫu số. Kết quả Clover 6 bài là sơ bộ, không chứng minh hệ thống vượt trội tổng quát. Không lấy số liệu từ các lần chạy hoặc mô hình khác nhau ghép thành một bảng. |
| “Unit test hữu hạn O(1) so với chứng minh trên toàn không gian” | Đây là cách diễn đạt sai về độ phức tạp và quá rộng. Dafny/Z3 chứng minh các nghĩa vụ kiểm chứng suy ra từ đặc tả và mô hình ngôn ngữ, trong phạm vi hỗ trợ; không bảo đảm đặc tả đúng yêu cầu hay chương trình triển khai ở ngôn ngữ khác tương đương. | Nói: kiểm thử mẫu hữu hạn có thể bỏ sót trường hợp; kiểm chứng hình thức kiểm tra các nghĩa vụ suy ra từ đặc tả đã viết, với các giả định và giới hạn của công cụ. |
| “Zero-Hallucination”, “đúng tuyệt đối 100%”, “loại bỏ ảo giác” | Đây là tuyên bố vượt quá bằng chứng. Trạng thái Verified chỉ chứng minh mã Dafny thỏa đặc tả đang được kiểm tra và các giả định của verifier. | Dùng “được Dafny xác minh theo đặc tả” hoặc “giảm nguy cơ lỗi logic trong phạm vi đặc tả”. Tránh tuyên bố loại bỏ hoàn toàn hallucination. |
| “CEGAR tự động lấy phản ví dụ cụ thể của Z3” | Pipeline có nhánh gọi `extract_counterexample` và lưu mô tả nếu parser lấy được; sự hiện diện của nhánh không chứng minh mọi lỗi đều có phản ví dụ cụ thể, hoặc CEGAR đã đóng góp vào kết quả. | Gọi đây là cơ chế thử nghiệm trích xuất/phản hồi phản ví dụ; đo tỷ lệ có phản ví dụ và tỷ lệ sửa thành công riêng. Không đồng nhất mọi chẩn đoán Dafny với phản ví dụ Z3. |
| “12 hình thái”, “21/23 quy tắc”, “bốn trụ cột hoàn chỉnh” | Các tài liệu mô tả khác nhau về số topology/quy tắc và mức hoàn thiện. Danh sách mẫu trong code/tài liệu không thay thế đánh giá độ bao phủ. | Trình bày những module đã tích hợp (phát hiện dạng bài, chuẩn hóa, khóa đặc tả, phân tích lỗi/sửa lặp), kèm giới hạn. Chỉ nêu số lượng sau khi lập danh sách và quy tắc đếm có thể kiểm chứng. |
| “So sánh Stanford Clover: họ chỉ có 6 bài, phụ thuộc GPT-4…” | Repo có tập nội bộ 6 bài gắn nhãn Clover và file kết quả đối chiếu; chưa đủ cơ sở để mô tả toàn bộ công trình Clover hoặc quy trình gốc như bảng Gemini. | Nêu đúng phạm vi của đối chiếu nội bộ: cùng 6 bài trong tệp hiện có, cấu hình repo, môודל, lượt chạy và ngày. Tránh gán thuộc tính không kiểm chứng cho nghiên cứu gốc. |
| Kết quả dự kiến đã gồm bài báo hội nghị/tạp chí | Chưa có thông tin về yêu cầu tài trợ, quy định nghiệm thu, kinh phí hay thời hạn toàn dự án. | Đưa báo cáo, mã nguồn, benchmark và dữ liệu thực nghiệm thành đầu ra dự kiến có điều kiện. Bài báo chỉ là mục tiêu nếu quy định và tiến độ cho phép, không cam kết nhận đăng. |
| “03 ngày” từ 15/10 đến sự kiện 18/10 | Có ba ngày chuẩn bị nội dung trước buổi 18/10; ngày 18 là ngày trình bày. | Gọi rõ là kế hoạch chuẩn bị slide từ 15 đến 17/10 và rà soát trước giờ họp ngày 18/10. |

### Phạm vi kết luận nghiên cứu

Đối tượng được kiểm chứng là mã Dafny được sinh/sửa theo đặc tả đầu vào và được Dafny xác nhận. Điều đó không tự chứng minh rằng đặc tả mô tả đúng nhu cầu người dùng, rằng chương trình không có mọi loại lỗi, hoặc rằng kết quả chuyển sang Python/C++/Java vẫn giữ nguyên tính chất. Cần phân biệt rõ **đúng theo đặc tả**, **đúng theo ý định**, và **chạy đúng trong triển khai thực tế**.

---

## 2. Câu hỏi, mục tiêu và phạm vi nghiên cứu đề xuất

### Câu hỏi nghiên cứu

**RQ1.** Khi giữ nguyên tập bài toán, mô hình, phiên bản công cụ và ngân sách sinh/sửa, vòng lặp có kiểm chứng hình thức cải thiện tỷ lệ bài được xác minh so với sinh một lần hay không?

**RQ2.** Các thành phần hướng dẫn hình thái bài toán, chuẩn hóa cú pháp, khóa đặc tả và phản hồi lỗi/ phản ví dụ đóng góp riêng và kết hợp như thế nào?

**RQ3.** Mức cải thiện về tỷ lệ xác minh có đi kèm chi phí thời gian, số lần gọi mô hình, token và tỷ lệ thất bại vận hành nào?

### Mục tiêu

1. Mô tả và đóng gói một pipeline tích hợp LLM với Dafny/Z3, trong đó đặc tả gốc được bảo toàn và mã chỉ được ghi nhận Verified khi Dafny trả kết quả xác minh thành công.
2. Đánh giá pipeline trên một tập benchmark được chốt, có nguồn gốc và điều kiện chạy rõ ràng; báo cáo cả kết quả thành công lẫn thất bại.
3. So sánh baseline và các cấu hình ablation dưới cùng điều kiện, dùng Pass@1, Pass@K, thời gian, số lần sửa, token/chi phí nếu lấy được và tỷ lệ lỗi không xác định.
4. Phân tích giới hạn, tính tái lập và phạm vi áp dụng của phương pháp.

### Phạm vi khả thi

Trong thời gian tài trợ, ưu tiên đánh giá và phân tích trên Dafny, benchmark đã có, các mô hình truy cập được và một số thuật toán/cấu trúc dữ liệu có đặc tả rõ. Mở rộng sang ngôn ngữ khác, tự động sinh đặc tả tổng quát, cây/danh sách nâng cao và chứng minh hiệu quả trên phần mềm thực tế là hướng tiếp theo, trừ khi nhóm có lịch và nguồn lực xác nhận được.

---

## 3. Thiết kế thực nghiệm cần chốt

### 3.1 Đóng băng tập dữ liệu và điều kiện chạy

- Lập manifest benchmark: mã bài, tên, nhóm, nguồn, phiên bản/commit, điều kiện đầu vào và trạng thái kiểm tra thủ công đặc tả.
- Xác định rõ 30 bài trong README hay 35 tệp hiện có là tập nghiên cứu. Không đưa bài chưa chạy/không tương thích vào mẫu số thành công.
- Với mỗi cấu hình, chạy cùng một tập bài, cùng model ID và phiên bản, prompt, nhiệt độ, `max_k`, timeout, phần cứng và phiên bản Dafny/Z3. Ghi ngày, cấu hình, lỗi API, timeout và bài bị loại.
- Nếu mô hình có tính ngẫu nhiên, lặp nhiều seed/lượt độc lập khi ngân sách cho phép; nếu chỉ chạy một lượt, ghi rõ đây là kết quả thăm dò, không suy rộng.
- Lưu dữ liệu thô theo từng bài và từng attempt; tạo bảng tổng hợp từ dữ liệu này, không nhập số thủ công từ README hoặc các báo cáo có thời điểm khác nhau.

### 3.2 Baseline và ablation

Tối thiểu so sánh:

1. **Sinh một lần:** LLM sinh mã, Dafny kiểm chứng; không có vòng sửa.
2. **Vòng lặp sửa cơ bản:** phản hồi lỗi Dafny, không có chỉ dẫn topology/chuẩn hóa/CEGAR tùy theo baseline được định nghĩa.
3. **Pipeline đầy đủ:** các thành phần đang nghiên cứu được bật.
4. **Ablation theo thành phần:** tắt từng thành phần một, giữ mọi yếu tố khác cố định.

Phải mô tả rõ baseline “Clover-inspired” là cấu hình tái lập trong repo, hay kết quả được tái tạo từ mã/phương pháp của bài Clover. Không gọi cấu hình tự xây là “Stanford Clover gốc” nếu chưa tái tạo đúng giao thức và dữ liệu của công trình.

### 3.3 Chỉ số và định nghĩa

- **Pass@1:** tỷ lệ bài được Dafny xác minh ở lần sinh đầu / tổng số bài hợp lệ đã chạy.
- **Pass@K:** tỷ lệ bài được xác minh trong tối đa K lượt / cùng mẫu số.
- **Tỷ lệ sửa thành công:** số bài thất bại ở lượt đầu nhưng được xác minh trong các lượt sửa / số bài thất bại ở lượt đầu. Báo cả tử số và mẫu số.
- **Thời gian:** báo trung vị và khoảng tứ phân vị bên cạnh trung bình; nêu cách tính, có bao gồm thời gian gọi API/timeout hay không.
- **Chi phí:** số lần gọi, token đầu vào/đầu ra và chi phí tiền tệ nếu nhà cung cấp trả số liệu đáng tin cậy; nếu thiếu, ghi N/A, không ước đoán.
- **Spec tampering:** số lần phát hiện thay đổi đặc tả / tổng lượt sinh có kiểm tra. Đo bằng bộ phát hiện đã nêu, không khẳng định đã ngăn mọi kiểu thay đổi tương đương về logic.
- **CEGAR:** số lỗi có phản ví dụ được trích xuất / số lần Dafny thất bại; trong đó bao nhiêu trường hợp phản hồi dẫn tới sửa thành công. Tách lỗi cú pháp, lỗi chứng minh, timeout và lỗi môi trường.

### 3.4 Tính hợp lệ và rủi ro

- Đặc tả yếu hoặc sai có thể cho phép chương trình không đáp ứng ý định thực tế; cần kiểm tra đặc tả độc lập.
- Bộ benchmark nhỏ, chọn từ các bài có sẵn hoặc trùng với pattern trong heuristic có nguy cơ thiên lệch và không đại diện tác vụ thực tế.
- So sánh các mô hình khác phiên bản, khác prompt hay khác ngân sách không cho phép quy kết chênh lệch cho pipeline.
- Z3/Dafny có thể timeout hoặc không chứng minh được mệnh đề dù chương trình đúng; phân loại “không chứng minh được” riêng với “đã chứng minh sai”.
- Tăng Pass@K có thể do tăng số lần gọi mô hình; báo rõ ngân sách để so sánh công bằng.
- Không dùng từ “ảo giác” như một biến đo nếu chưa định nghĩa thao tác đo lường. Ưu tiên “lỗi vi phạm đặc tả”, “lỗi cú pháp”, “thay đổi đặc tả” và “không xác minh được”.

---

## 4. Tiến độ nghiên cứu đề xuất sau buổi góp ý

Thời hạn tài trợ chính thức và yêu cầu nghiệm thu chưa có trong tài liệu người dùng cung cấp. Bảng dưới đây là khung theo giai đoạn; chuyển thành tháng/ngày sau khi đối chiếu biểu mẫu của Khoa và thời hạn thực tế.

| Giai đoạn | Công việc | Đầu ra kiểm tra được | Điều kiện hoàn tất |
|---|---|---|---|
| 1. Chốt câu hỏi và khảo sát | Rà nghiên cứu liên quan; chốt RQ, định nghĩa baseline, phạm vi và tiêu chí benchmark | Đề cương nghiên cứu và bảng liên quan | Mỗi tuyên bố có nguồn; thuật ngữ và giả thuyết đo được |
| 2. Kiểm kê và đóng băng benchmark | Manifest, xác minh nguồn/đặc tả, chốt tập; lưu cấu hình và phiên bản công cụ | Bộ benchmark phiên bản hóa và giao thức chạy | Mọi bài trong mẫu số có đặc tả, nguồn và trạng thái rõ |
| 3. Chạy baseline và pipeline | Chạy cùng điều kiện, lưu log thô; lặp seed nếu khả thi | JSON/CSV theo bài, attempt, model và cấu hình | Không thiếu dữ liệu; lỗi vận hành được phân loại |
| 4. Phân tích và ablation | Tính chỉ số, độ bất định phù hợp, phân tích lỗi và chi phí | Báo cáo kết quả, bảng/biểu đồ tái sinh được | Kết luận giới hạn theo mẫu và điều kiện đã chạy |
| 5. Hoàn thiện sản phẩm nghiên cứu | Tài liệu hướng dẫn, đóng gói demo, mã nguồn và dữ liệu được phép chia sẻ | Prototype, tài liệu, dữ liệu và báo cáo tổng kết | Có hướng dẫn tái lập; loại bỏ khóa API/ dữ liệu nhạy cảm |
| 6. Viết và nghiệm thu | Viết báo cáo; chuẩn bị bài báo nếu thời gian/quy định phù hợp; đối chiếu mẫu nghiệm thu | Báo cáo NCKH và hồ sơ nghiệm thu; bản thảo nếu đạt | Không cam kết acceptance; số liệu khớp dữ liệu gốc |

### Phân công theo vai trò

Không tự gán tên thành viên khi chưa có danh sách và năng lực. Nhóm điền tên sau khi thống nhất:

| Vai trò | Trách nhiệm | Đầu ra |
|---|---|---|
| Điều phối và phương pháp | Chốt câu hỏi, protocol, kiểm tra tính công bằng của so sánh, quản lý tiến độ | Protocol, biên bản quyết định, báo cáo tổng hợp |
| Pipeline và Dafny | Mô tả luồng, phiên bản công cụ, phân loại chẩn đoán và lỗi verifier | Tài liệu kiến trúc, log chạy, phân tích lỗi |
| Benchmark và dữ liệu | Manifest, nguồn, kiểm tra đặc tả, quản lý dữ liệu thô | Benchmark phiên bản hóa, bảng chỉ số |
| Thực nghiệm mô hình | Cấu hình model/prompt/ngân sách, chạy lặp, ghi token/latency | Kết quả tái lập theo cấu hình |
| Viết và trình bày | Tổng hợp tài liệu, slide, kịch bản 5 phút, ghi nhận góp ý | Slide, báo cáo, danh sách việc chỉnh sửa |

Một người có thể kiêm nhiều vai trò; mỗi đầu ra cần một người chịu trách nhiệm cuối cùng và một người rà soát.

---

## 5. Kế hoạch chuẩn bị trong ba ngày

| Ngày | Việc chính | Đầu ra cuối ngày |
|---|---|---|
| 15/10 | Chốt một câu mô tả đề tài, mục tiêu, phạm vi; kiểm kê bằng chứng có thể trình bày; phân công người nói và người rà số liệu | Nội dung 7 slide ở dạng gạch đầu dòng; bảng số liệu có nguồn tệp, ngày chạy, mẫu số |
| 16/10 | Dựng slide tối giản; chọn ảnh chụp pipeline/kết quả từ lần chạy có log; chuẩn bị ví dụ một bài thất bại lần đầu và kết quả sửa nếu dữ liệu thật có | Bản slide đầu; ghi chú nguồn cho từng số liệu; demo tĩnh dự phòng |
| 17/10 | Tập nói có bấm giờ; kiểm tra âm thanh, quyền truy cập Meet, phương án chia sẻ màn hình; tập Q&A về tính mới, baseline, đặc tả và giới hạn | Bản slide chốt; bài nói ≤4 phút 30 giây; một bản PDF dự phòng |
| 18/10 trước buổi họp | Mở sẵn Meet và slide, kiểm tra tên hiển thị/kết nối, vào phòng sớm | Sẵn sàng trình bày lúc 19:00 |

Không dành ba ngày để mở rộng benchmark hay hứa thêm tính năng. Ưu tiên tính đúng của câu chuyện và số liệu đã có. Demo trực tiếp chỉ dùng nếu đã kiểm tra ổn định; nếu không, dùng ảnh/video ngắn có nguồn từ lần chạy thật. Không dựng cảnh thất bại hoặc kết quả xác minh.

---

## 6. Dàn ý 7 slide cho phần trình bày 5 phút

| Slide | Nội dung | Thời lượng |
|---|---|---:|
| 1. Đề tài và nhóm | Tên đề tài, thành viên, GVHD; một câu mô tả dễ hiểu | 20 giây |
| 2. Vấn đề | LLM có thể sinh chương trình không thỏa đặc tả; test mẫu hữu hạn có thể bỏ sót trường hợp | 40 giây |
| 3. Mục tiêu và câu hỏi | Đo xem kiểm chứng và phản hồi lỗi có cải thiện tỷ lệ xác minh trong phạm vi benchmark hay không | 35 giây |
| 4. Phương pháp | Sơ đồ: đặc tả → LLM sinh → Dafny/Z3 xác minh → trả chẩn đoán/ sửa tối đa K lượt → báo Verified hoặc chưa xác minh | 60 giây |
| 5. Prototype và bằng chứng hiện có | Ảnh UI; tách kết quả Clover 6 bài khỏi kết quả 35-task cross-model; ghi model, ngày, N và mẫu số; nêu thất bại | 55 giây |
| 6. Kế hoạch nghiên cứu và đầu ra | Đóng băng benchmark, baseline/ablation, lặp và phân tích; đầu ra có điều kiện theo yêu cầu nghiệm thu | 55 giây |
| 7. Giới hạn và đề nghị góp ý | Đặc tả là giả định trọng yếu; kết quả hiện sơ bộ; xin góp ý về phạm vi, benchmark và tiêu chí đánh giá | 35 giây |
| **Tổng** | Có khoảng đệm cho chuyển slide | **5 phút** |

### Câu nói một câu

“Nhóm xây dựng một quy trình trong đó mô hình ngôn ngữ sinh mã Dafny, bộ kiểm chứng kiểm tra mã theo đặc tả, rồi phản hồi lỗi để mô hình thử sửa; nghiên cứu sẽ đo xem quy trình này cải thiện tỷ lệ mã được xác minh và tốn thêm bao nhiêu thời gian, lượt gọi.”

### Cách ghi kết quả trên slide

Chỉ dùng bảng rút gọn với cột **tập bài, số bài chạy/tổng, model, cấu hình, Pass@1, Pass@K, ngày**. Ví dụ kết quả repo đang có:

- Clover comparison: `N=6`; baseline: `Pass@1 4/6`, `Pass@K 5/6`; hệ thống: `Pass@1 5/6`, `Pass@K 6/6`; model `ollama/qwen2.5-coder:7b`, theo file có timestamp 05/10/2026. Đây là mẫu nhỏ, một cấu hình/lần chạy theo file, chưa đủ để kết luận ưu thế tổng quát.
- Cross-model kết quả mới nhất: task set 35; GPT-OSS chạy 29, đạt `16/29` (`55.2%`); Qwen 3.8-27B có `0` bài. Không gọi đây là kết quả của 35 bài hoàn tất hay bằng chứng Qwen thất bại 35/35; trạng thái 0 bài cần xem như lỗi/chạy chưa hoàn thành.

Nếu slide cần số hiện trạng đã chạy lại, thay các số trên bằng một lần chạy có log mới và giữ nguyên file raw. Không lấy số test từ badge/tài liệu cũ làm kết quả nghiên cứu.

---

## 7. Chuẩn bị trả lời góp ý

**Đóng góp của nhóm là gì nếu Dafny, Z3 và LLM đã có sẵn?**  
Đóng góp dự kiến nằm ở thiết kế và đánh giá cách điều phối các thành phần: bảo toàn đặc tả, đưa chỉ dẫn theo dạng bài, chuẩn hóa đầu ra và dùng chẩn đoán từ verifier cho vòng sửa. Mức đóng góp khoa học cần được xác nhận bằng ablation cùng điều kiện; hiện chưa nên tuyên bố mới hơn hay tốt hơn Clover khi chưa tái tạo giao thức đối chứng.

**Tại sao chọn Dafny?**  
Dafny cung cấp đặc tả và kiểm chứng trong cùng ngôn ngữ, phù hợp để khảo sát vòng lặp sinh/sửa mã có phản hồi hình thức. Phạm vi hiện tại vì vậy tập trung vào mã Dafny; chuyển kết luận sang ngôn ngữ khác cần nghiên cứu và kiểm định riêng.

**Hệ thống có loại bỏ hoàn toàn ảo giác không?**  
Không thể kết luận như vậy. Hệ thống xác nhận mã thỏa các nghĩa vụ mà đặc tả và verifier tạo ra. Đặc tả sai hoặc chưa đủ vẫn có thể cho kết quả không đúng với ý định; một số chương trình có thể không được chứng minh trong giới hạn công cụ.

**Kết quả 100% trên benchmark nói lên điều gì?**  
Chỉ nói rằng trong tập, model, cấu hình và lượt chạy được nêu, mọi bài trong mẫu số đã đạt trạng thái Verified ở tối đa K lượt. Cần báo N, model, ngân sách, ngày chạy và kết quả thất bại ở các lần chạy khác; không suy rộng thành bảo đảm phổ quát.

**Kế hoạch có khả thi không?**  
Prototype và nhiều module đã tồn tại; phần nghiên cứu còn lại là làm sạch bằng chứng, chốt protocol, chạy baseline/ablation công bằng, phân tích thất bại và viết báo cáo. Mục tiêu đầu ra cuối cùng sẽ điều chỉnh theo thời hạn tài trợ và biểu mẫu nghiệm thu của Khoa.

---

## 8. Danh sách cần xác nhận trong nhóm trước khi nộp slide

- [ ] Chốt benchmark nghiên cứu là 30 hay 35 bài; giải thích tình trạng 5 bài cấu trúc quy nạp.
- [ ] Xác nhận phiên bản Dafny/Z3, model ID, prompt, `max_k`, timeout và ngày chạy cho mọi số liệu.
- [ ] Chạy lại hoặc bỏ số test; không trình bày 113/113 khi chưa có lệnh chạy, log và commit tương ứng.
- [ ] Rà sự khớp giữa README, manifest benchmark và CSV/JSON raw; ghi rõ tệp nào là nguồn chuẩn.
- [ ] Kiểm tra yêu cầu tài trợ: thời hạn, biểu mẫu, sản phẩm nghiệm thu và quy định công bố/mã nguồn.
- [ ] Điền tên thành viên vào vai trò; không mặc định một người thuyết trình nếu phân công nhóm chưa thống nhất.
- [ ] Kiểm tra giấy phép và cách ghi nguồn benchmark Clover/HumanEval trước khi chia sẻ dữ liệu hoặc tuyên bố tái lập công trình gốc.
- [ ] Chuẩn bị ảnh/video từ lần chạy thật và bản PDF slide dự phòng.

**Nguyên tắc báo cáo:** lưu dữ liệu thô; định nghĩa chỉ số trước khi xem kết quả; báo cả thất bại và mẫu số; không biến một kết quả trên tập nhỏ thành bảo đảm đúng tuyệt đối.
