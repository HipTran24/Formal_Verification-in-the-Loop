# Đánh giá quy mô đề tài và việc cần ưu tiên

**Đề tài:** Formal Verification-in-the-Loop  
**Bối cảnh:** chuẩn bị buổi trình bày góp ý ngày 18/10/2026; cần phân biệt việc cần làm trước buổi góp ý với khối lượng nghiên cứu trong thời gian tài trợ.  
**Phạm vi:** đánh giá repo và một số công trình học thuật tương tự. Không sửa code.

## Kết luận ngắn

**35 tệp benchmark hiện có không tự động làm đề tài quá nhỏ.** Quy mô bài toán không chỉ là số lượng; câu hỏi nghiên cứu, cách kiểm soát so sánh, tính hợp lệ của đặc tả, phân tích thất bại và khả năng tái lập quan trọng hơn. Với repo hiện tại, 35 tệp đủ để làm prototype và trình bày một hướng nghiên cứu khả thi, nhưng dữ liệu đang thấy **chưa đủ để bảo vệ các tuyên bố rộng** như “loại bỏ ảo giác”, “đúng tuyệt đối”, hay “vượt Clover”.

Việc cần ưu tiên gấp nhất không phải thêm hàng chục bài trong ba ngày. Cần làm rõ tập nào đã chạy, tạo một bảng số liệu có mẫu số và cấu hình nhất quán, định nghĩa baseline trung thực, nêu một đóng góp có thể kiểm nghiệm, và trình bày giới hạn. Sau khi được góp ý, nếu lịch tài trợ cho phép, mở rộng đánh giá trên một benchmark ngoài tập bài nhóm tự tạo và thực hiện baseline/ablation công bằng.

## Repo hiện có gì?

Kiểm kê các tệp `.dfy` cho thấy 35 tệp:

| Nhóm thư mục | Số tệp Dafny | Ghi chú |
|---|---:|---|
| Clover | 6 | Bài toán gắn nhãn Clover trong repo |
| HumanEval-Dafny | 10 | Tệp benchmark HumanEval được chuyển/biểu diễn bằng Dafny |
| Advanced | 14 | Bài toán do dự án mở rộng |
| Advanced Inductive | 5 | Bài cây/danh sách; một số tệp chỉ chứa đặc tả và để trống phần thân cho LLM |
| **Tổng tệp** | **35** | Không đồng nghĩa cả 35 đã được chạy thành công trong cùng một thí nghiệm |

Tài liệu trong repo chưa đồng nhất: README mô tả 30 bài; thư mục hiện có 35 tệp; các badge và kế hoạch cũ ghi số test khác nhau. Bởi vậy, cần gọi đây là **35 tệp bài toán hiện có** cho đến khi manifest và log chứng minh tập nào đã chạy. Số test phần mềm là một loại bằng chứng khác với số benchmark bài toán.

Kết quả thực nghiệm đang có cũng không đồng nhất:

- `artifacts/results/clover_vs_our_system_baseline.json`: một lần chạy trên 6 bài Clover với `ollama/qwen2.5-coder:7b`; baseline nội bộ 5/6 Pass@K, pipeline 6/6. Ở Pass@1 lần lượt là 4/6 và 5/6. Đây là dấu hiệu ban đầu đáng xem tiếp, chưa đủ để khẳng định ưu thế tổng quát hay tương đương tái lập nguyên bản Clover.
- `artifacts/results/cross_model_benchmark_latest.json`: bộ cấu hình liệt kê 35 task; GPT-OSS có kết quả 29 task và 16/29 thành công; cấu hình Qwen có 0 task. Đây không phải kết quả hoàn chỉnh 35/35 và trạng thái 0 task cần được làm rõ trước khi diễn giải.
- CSV/JSON có nhiều timestamp, model và kết quả. Không nên lấy các con số tốt nhất từ các lần chạy khác nhau ghép thành một kết quả chung.

## Nghiên cứu tương tự thường làm gì?

### 1. Clover: benchmark được thiết kế và tiêu chí kiểm định

Clover giới thiệu cách kiểm tra tính nhất quán giữa chương trình, mô tả tự nhiên và chú thích hình thức. Nhóm tác giả đánh giá trên CloverBench gồm 60 chương trình Dafny được thiết kế thủ công, đồng thời dùng phương pháp để phát hiện các chương trình sai trong MBPP-DFY-50. Bài báo báo cáo mức chấp nhận tới 87% cho trường hợp đúng và không nhận nhầm các trường hợp sai mang tính đối kháng trong thí nghiệm của họ. Bài tập trung vào **chất lượng bộ lọc nhất quán** và kiểm soát false positive, không chỉ trình diễn một giao diện hay đếm số module. [Bài báo Clover](https://arxiv.org/abs/2310.17807)

**Bài học cho dự án:** nếu dùng nhãn “Clover baseline”, phải định nghĩa chính xác phương pháp được tái lập, tập bài, model và điều kiện. Sáu bài trong thư mục dự án là tập con/nhãn nội bộ; không đại diện cho toàn bộ CloverBench 60 bài.

### 2. DafnyBench: quy mô lớn hơn, phân tích tác động của feedback

DafnyBench đánh giá hơn 750 chương trình, khoảng 53.000 dòng mã. Nghiên cứu đo khả năng sinh gợi ý để Dafny xác minh chương trình, tác động của việc thử lại với thông báo lỗi, và cách tỷ lệ thành công suy giảm khi chương trình cần nhiều mã/chú thích hơn. Kết quả tốt nhất họ báo cáo là 68% theo thiết lập nghiên cứu đó. [Bài báo DafnyBench](https://arxiv.org/abs/2406.08467)

**Bài học cho dự án:** một nghiên cứu có giá trị không cần đạt 100%; kết quả âm tính và phân tích độ khó cũng có ý nghĩa. Nếu chưa thể dùng toàn bộ benchmark lớn, có thể chọn một tập con được mô tả rõ, kiểm tra tính hợp lệ và so sánh cùng điều kiện.

### 3. Synthesis Dafny trên MBPP: so sánh prompt có kiểm soát

Công trình tại FSE 2024 dùng 178 bài MBPP, so sánh các kiểu prompt như contextless, signature kèm test, và CoT có retrieval. Họ đánh giá hai mô hình và báo tỷ lệ phương pháp tốt nhất, đồng thời phát hành các lời giải Dafny đã xác minh. [Trang bài tại FSE](https://2024.esec-fse.org/details/fse-2024-research-papers/75/Towards-AI-Assisted-Synthesis-of-Verified-Dafny-Methods)

**Bài học cho dự án:** một trục so sánh hẹp và công bằng (ví dụ sinh một lần so với sinh có phản hồi) có thể tạo câu hỏi nghiên cứu rõ hơn việc liệt kê nhiều kỹ thuật cùng lúc.

### 4. Sửa lỗi số học có đặc tả làm oracle

Một nghiên cứu sửa lỗi Dafny giới hạn phạm vi vào lỗi số học, dùng đặc tả làm oracle, mô tả bước định vị lỗi rồi tổng hợp bản sửa bằng nhiều mô hình. Trên DafnyBench, bài báo báo cáo độ bao phủ fault localization 89,6% và repair success cao nhất 74,18% cho một cấu hình mô hình. [Bài báo sửa lỗi Dafny](https://arxiv.org/abs/2507.03659)

**Bài học cho dự án:** thu hẹp loại lỗi và định nghĩa đầu ra đo được là một cách làm nghiên cứu chặt chẽ; không cần tuyên bố giải quyết toàn bộ “ảo giác”.

### 5. Nghiên cứu mới về kiểm chứng kết hợp nhiều hàm

DafnyCOMP (ICLR 2026) có 400 chương trình tổng hợp, từ 2–5 hàm với đồ thị gọi hàm khác nhau. Nghiên cứu thấy các mô hình có thể đạt kết quả khá trên tác vụ đơn hàm nhưng gần như không xác minh được tác vụ tổng hợp trong thiết lập của họ. [Bài DafnyCOMP tại ICLR 2026](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c04d37be05ba74419d2d5705972a9d64-Abstract-Conference.html)

**Bài học cho dự án:** hướng mở rộng có ý nghĩa không nhất thiết là thêm bài mảng tương tự; có thể kiểm tra một chiều khó hơn như nhiều hàm phụ thuộc nhau. Tuy nhiên, đây là hướng dài hạn; không nên đưa vào cam kết ba ngày.

## Đề tài hiện đủ quy mô đến đâu?

### Đủ cho vòng trình bày ý tưởng/prototype

- Có pipeline vận hành được, giao diện demo và nhiều module kỹ thuật.
- Có nhiều nhóm bài toán và kết quả chạy lưu trong repo.
- Có ít nhất một kết quả đối chiếu nội bộ trên 6 bài cùng một model.
- Có thể đặt câu hỏi thực nghiệm cụ thể về tác động của verifier feedback và các thành phần của pipeline.

Đây là cơ sở tốt để trình bày **tính khả thi và hướng nghiên cứu**, nhất là vì buổi sắp tới là buổi góp ý đề cương, không phải báo cáo kết quả cuối kỳ.

### Chưa đủ cho tuyên bố nghiên cứu rộng

- Kích thước và thành phần tập benchmark chưa được chốt thống nhất; 5 bài inductive có thể chỉ là đặc tả chờ sinh, không có nghĩa đã benchmark.
- Chưa thấy một protocol duy nhất áp dụng thống nhất cho mọi kết quả: model/version, prompt, seed, ngân sách sửa, timeout, cache, phần cứng và thời điểm chạy.
- Kết quả Clover hiện có chỉ 6 bài và một lần chạy được lưu; chênh 1 bài ở Pass@K chưa đủ kết luận vượt trội.
- Baseline “Clover” trong script dự án cần được mô tả là cấu hình tái lập nội bộ nếu chưa thực thi đúng mã và protocol của bài gốc.
- Chưa thấy khoảng bất định/dao động giữa nhiều lượt chạy, phân tích theo loại bài, hay ablation được báo cáo trong một protocol hoàn chỉnh.
- Đặc tả là giả định trọng yếu. Chứng minh code thỏa `ensures` không chứng minh `ensures` phản ánh đầy đủ ý định.
- Các cụm “Zero-Hallucination”, “100% đúng tuyệt đối”, “đảm bảo toàn bộ không gian” đang vượt quá phạm vi chứng cứ.

**Đánh giá:** vấn đề chính hiện nay là **độ tin cậy và khả năng diễn giải của thực nghiệm**, không phải chỉ thiếu số lượng bài. Tăng số lượng mà không chuẩn hóa nguồn, đặc tả và cách chạy sẽ làm tập lớn hơn nhưng không làm kết luận mạnh hơn.

## Việc cần cải thiện gấp

### Trước buổi góp ý: ưu tiên P0

1. **Thu hẹp tuyên bố đề tài.** Đề xuất mô tả: “Nghiên cứu tác động của vòng phản hồi kiểm chứng Dafny/Z3 và một số thành phần điều phối đến tỷ lệ xác minh mã Dafny do LLM sinh trên tập benchmark được kiểm soát.” Không hứa loại bỏ toàn bộ hallucination.
2. **Chốt một kết quả duy nhất để trình bày.** Ưu tiên Clover 6 bài vì baseline và hệ thống được lưu trong cùng một JSON, kèm model và timestamp. Ghi rõ `N=6`, Pass@1 và Pass@K, gọi là kết quả sơ bộ. Không trộn với kết quả 35 task.
3. **Kiểm tra các bài trong con số 35.** Nói “35 tệp benchmark hiện có” nếu chưa xác nhận đã chạy đủ. Xác định năm tệp inductive đã được xác minh/chạy chưa; nếu chưa, trình bày là phạm vi mở rộng dự kiến.
4. **Bỏ các số không có log chuẩn.** Không dùng 113/113 tests hay 100% benchmark nếu không có lệnh, log, commit và mẫu số tương ứng. Không cần chạy toàn bộ test suite để kịp slide; chỉ trình bày số lịch sử có thể truy nguồn hoặc không nêu.
5. **Định nghĩa đóng góp vừa sức.** Nêu giả thuyết có thể bác bỏ: “Với cùng model, tập bài và ngân sách K, phản hồi lỗi verifier làm tăng Pass@K so với sinh một lần; các ablation sẽ xác định module nào đóng góp.” Đây là giả thuyết cần kiểm tra, không phải kết luận đã biết.
6. **Đưa giới hạn và câu hỏi xin góp ý lên slide.** Xin hội đồng góp ý về benchmark, baseline và phạm vi đánh giá; thể hiện nhóm hiểu điều kiện để kiểm chứng tính khả thi.
7. **Không thêm bài mới trong ba ngày chỉ để tăng N.** Nếu còn thời gian, dùng thời gian đó để truy nguồn số liệu, kiểm tra ảnh demo và luyện bài nói.

### Trong giai đoạn tài trợ: ưu tiên P1

1. Chốt manifest 30 hay 35 (hoặc tập con hợp lệ), nguồn từng bài, giấy phép, đặc tả, độ khó và lý do loại bài.
2. Lập protocol cố định: model/version, prompt, nhiệt độ, số lượt K, timeout/resource limit, cache, số lần lặp, phần cứng, Dafny/Z3 và quy tắc xử lý lỗi API.
3. Chạy ít nhất ba cấu hình cùng tập/cùng ngân sách: sinh một lần; sửa với thông báo Dafny; pipeline đầy đủ. Tắt từng module một khi đủ nguồn lực.
4. Nếu có thể, lặp nhiều lượt độc lập cho model sinh ngẫu nhiên; báo số lần chạy, độ phân tán hoặc khoảng tin cậy phù hợp. Nếu chỉ có một lần, gọi kết quả thăm dò.
5. Báo theo nhóm độ khó/topology và phân tích thất bại: parse/type, invariant/proof, termination, timeout, API/infra, đặc tả không hợp lệ.
6. Đo tỷ lệ sửa thành công với tử số/mẫu số; latency trung vị; số lượt gọi/token và chi phí nếu có dữ liệu đáng tin cậy.
7. Xem xét benchmark ngoài do nhóm tự tạo (ví dụ phần phù hợp của DafnyBench/MBPP-DFY) để giảm nguy cơ đánh giá trên pattern do chính topology heuristic tạo ra. Chốt giấy phép và khả năng tái lập trước khi dùng.
8. Kiểm tra đặc tả độc lập bởi người hiểu bài toán; bổ sung test oracle/kiểm tra ngữ nghĩa khi thích hợp. Không để hệ thống tự xác nhận đặc tả do nó sửa.

### Chỉ mở rộng sau khi giao thức ổn định: P2

- Benchmark compositional nhiều hàm, bài toán khó hơn hoặc cấu trúc dữ liệu quy nạp.
- So sánh nhiều model/cloud/local và đo CoT/overthinking.
- Mở rộng sang ngôn ngữ khác.
- Đề xuất taxonomy hallucination mới hoặc tuyên bố đóng góp phương pháp mới.

Những hạng mục này có thể là hướng phát triển, nhưng làm đồng thời sẽ tạo quá nhiều biến và khiến không rõ nguyên nhân cải thiện.

## Một kế hoạch nghiên cứu gọn và có thể bảo vệ

### Câu hỏi chính

**Trong một tập bài Dafny được chốt và có đặc tả kiểm tra, phản hồi từ Dafny/Z3 có cải thiện tỷ lệ chương trình được xác minh so với sinh một lần cho cùng mô hình và ngân sách sinh/sửa hay không?**

### Thiết kế tối thiểu

| Nhánh | Cấu hình | Vai trò |
|---|---|---|
| A | LLM sinh một lần → Dafny verify | Baseline zero-shot |
| B | LLM sinh/sửa tối đa K lần, nhận thông báo lỗi Dafny | Đo tác động của vòng feedback |
| C | Pipeline có các module đề xuất | Đo hiệu quả tổng thể |
| D (nếu đủ lực) | Tắt từng module của C | Ước lượng đóng góp riêng |

Giữ cố định model, bài, đặc tả, prompt cơ sở, timeout và ngân sách; ghi mọi lần chạy thất bại. So sánh Pass@1, Pass@K, số bài sửa được, thời gian và chi phí. Có thể bắt đầu với 30 bài cốt lõi đã chạy ổn; 5 bài inductive được đưa vào một nhóm mở rộng riêng khi kiểm tra được.

### Đầu ra có thể nghiệm thu

- Prototype tích hợp LLM với Dafny/Z3 và tài liệu vận hành.
- Benchmark có manifest, nguồn, đặc tả và trạng thái xác minh rõ.
- Bộ dữ liệu thô cùng script hoặc hướng dẫn tái tính bảng kết quả.
- Báo cáo thực nghiệm có baseline, ablation khả thi, phân tích lỗi và giới hạn.
- Bản thảo bài báo là mục tiêu nếu thời hạn và quy định nghiệm thu cho phép; không cam kết được nhận đăng.

## Gợi ý thông điệp cho slide

> “Nhóm đã có prototype và kết quả ban đầu trên các bài Dafny, nhưng hiện cần chuẩn hóa tập benchmark và điều kiện so sánh. Trong đề tài, nhóm sẽ kiểm tra riêng tác động của phản hồi Dafny/Z3 và từng thành phần đến tỷ lệ xác minh, đồng thời báo cáo chi phí và các trường hợp thất bại. Kết luận chỉ giới hạn trong đặc tả và tập bài được đánh giá.”

Thông điệp này thừa nhận sản phẩm hiện có, chỉ rõ phần nghiên cứu còn lại và không phóng đại độ tin cậy.

## Tài liệu tham khảo đã đối chiếu

1. Sun, C. et al. **Clover: Closed-Loop Verifiable Code Generation.** arXiv:2310.17807. [Trang bài báo](https://arxiv.org/abs/2310.17807)
2. Loughridge, C. et al. **DafnyBench: A Benchmark for Formal Software Verification.** arXiv:2406.08467. [Trang bài báo](https://arxiv.org/abs/2406.08467)
3. Misu, M. R. H. et al. **Towards AI-Assisted Synthesis of Verified Dafny Methods.** FSE 2024. [Trang hội nghị](https://2024.esec-fse.org/details/fse-2024-research-papers/75/Towards-AI-Assisted-Synthesis-of-Verified-Dafny-Methods) · [Preprint](https://arxiv.org/abs/2402.00247)
4. Wu, V. et al. **Specification-Guided Repair of Arithmetic Errors in Dafny Programs using LLMs.** arXiv:2507.03659. [Trang bài báo](https://arxiv.org/abs/2507.03659)
5. **Local Success Does Not Compose: Benchmarking Large Language Models for Compositional Formal Verification.** ICLR 2026. [Trang kỷ yếu](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c04d37be05ba74419d2d5705972a9d64-Abstract-Conference.html)

*Số liệu và mô tả bài báo trên được đối chiếu với trang bài báo/kỷ yếu trong lần rà soát ngày 15/10/2026. Kết quả trong repo được dẫn theo các tệp hiện có; đây chưa phải kiểm toán đầy đủ toàn bộ lịch sử thực nghiệm.*
