# BÁO CÁO KẾT QUẢ THỰC NGHIỆM ĐỐI CHUẨN ABLATION STUDY (30 BÀI TOÁN CỐT LÕI)
**Dự án:** Nghiên cứu khung sinh mã nguồn và tự sửa lỗi tự động dựa trên kiểm định logic hình thức (Formal Verification-in-the-Loop)  
**Thời điểm thực nghiệm:** 14:34:40, ngày 15/10/2026  
**Mô hình đánh giá:** `ollama/qwen2.5-coder:7b` (Chạy cục bộ 100% Offline, đảm bảo tính tái lập khoa học)  
**Tệp dữ liệu thô (Raw Data):** `artifacts/results/clover_vs_our_system_baseline.json`  
**Quy mô:** 30 bài toán thuật toán cốt lõi (`Core-30 Benchmark`) thuộc 3 nhóm: Clover (6 bài), HumanEval-Dafny (10 bài), Advanced (14 bài) trong tổng số 35 bài có sẵn của kho lưu trữ.

---

## 1. BẢNG TỔNG HỢP ĐỐI ĐẦU TRỰC TIẾP (HEAD-TO-HEAD ABLATION MATRIX)

Thực nghiệm so sánh bóc tách đối đầu trực tiếp giữa cấu hình **Baseline nội bộ (Lấy cảm hứng từ Clover)\*** (tắt toàn bộ 4 trụ cột kỹ thuật) và **Hệ Thống Đề Xuất** (bật đầy đủ 4 trụ cột Neuro-Symbolic) trên cùng một mô hình và cùng điều kiện chạy:

| Chỉ số khoa học | Cấu hình Baseline nội bộ (Clover-inspired)\* | Hệ Thống Đề Xuất (Our System) | Chênh lệch / Đóng góp thực tế |
| :--- | :---: | :---: | :---: |
| **Quy mô bài toán ($N$)** | 30 bài | 30 bài | Tập benchmark cốt lõi cố định |
| **Pass@1 (Lần đầu)** | **16.7%** (5/30 bài) | **93.3%** (28/30 bài) | 🚀 **Tăng +76.6% (5.6 lần)** |
| **Pass@3 (Sau tự sửa)** | **20.0%** (6/30 bài) | **96.7%** (29/30 bài) | 🏆 **Tăng +76.7% (4.8 lần)** |
| **Vi phạm đặc tả ($H_1$)** | **3.3%** (1/30 bài sửa đề) | **0.0%** (0/30 bài vi phạm) | 🛡️ **Khóa SHA-256 bảo vệ toàn vẹn** |
| **Số vòng lặp TB ($Loops$)\*\*** | **2.63 lượt/bài** | **1.10 lượt/bài** | ⚡ **Giảm 58% số lần gọi LLM** |
| **Thời gian giải TB ($T_{avg}$)\*\***| **214.5 giây** (~3.5 phút/bài) | **60.8 giây** (~1.0 phút/bài) | ⏱️ **Rút ngắn 3.5 lần** |
| **Tổng thời gian chạy** | **6436.2 giây** (~1.8 tiếng) | **1825.2 giây** (~30 phút) | 💡 **Tiết kiệm 71.6% thời gian & tài nguyên** |
| **Tự sửa nhờ phản hồi lỗi Dafny** | 1 bài (`abs_val`) | 1 bài (`031-is-prime`) | 🎯 **Tự điều chỉnh logic thành công** |

> (\*) **Ghi chú về Baseline nội bộ**: Cấu hình baseline được thiết lập bằng cách tắt 4 trụ cột kỹ thuật (`enable_topology=False`, `enable_normalizer=False`, `enable_spec_locker=False`, `enable_cegar=False`) nhằm mô phỏng quy trình sinh mã và kiểm tra trực diện kiểu Clover trên cùng hạ tầng cục bộ; chưa bao gồm toàn bộ hệ thống prompt và heuristic riêng biệt của bản triển khai gốc từ Đại học Stanford.  
> (\*\*) **Định nghĩa chỉ số & điều kiện đo lường**:
> - $Loops = 33 \text{ lượt} / 30 \text{ bài} = 1.10 \text{ lượt/bài}$ (trong đó 28 bài vượt qua ở Lượt 1, 1 bài vượt qua ở Lượt 2, 1 bài không qua sau 3 lượt: $(28 \times 1) + (1 \times 2) + (1 \times 3) = 33$ lượt).
> - Giới hạn thời gian thẩm định của Dafny/Z3 là 15 giây/lần (`timeout = 15s`). Thời gian trung bình ($T_{avg}$) và tổng thời gian tính gộp cả độ trễ suy diễn của LLM (LLM inference latency) và thời gian giải của Z3 Solver.

---

## 2. BỐN PHÁT HIỆN KHOA HỌC THEN CHỐT (SCIENTIFIC INSIGHTS)

### Phát hiện 1: Giá trị đóng góp thực tế của 4 trụ cột kỹ thuật (+76.7%)
* Khi tắt 4 trụ cột kỹ thuật (Topology, Normalizer, SpecLocker, CEGAR), mô hình `Qwen2.5-Coder-7B` chỉ giải được **5/30 bài ở Pass@1 (16.7%)** và **6/30 bài ở Pass@3 (20.0%)**. Mô hình chủ yếu chỉ vượt qua các bài toán số học đơn giản không có vòng lặp (`abs_val`, `find_min`, `sample_max`, `sign_function`), còn lại bế tắc trước bất biến vòng lặp hoặc lỗi cú pháp Dafny.
* Khi kích hoạt 4 trụ cột của hệ thống, tỷ lệ xác minh đạt **93.3% (Pass@1)** và **96.7% (Pass@3)**.
* **Ý nghĩa:** Chênh lệch **+76.7%** trên tập thử nghiệm cho thấy việc kết hợp phân loại hình thái thuật toán (Topology Directive) và chuẩn hóa cú pháp source-to-source (Syntax Normalizer) giúp mô hình LLM sinh mã tuân thủ quy tắc kiểm định tốt hơn rõ rệt so với phương thức prompt trực diện.

### Phát hiện 2: Hiện tượng mô hình tự sửa đặc tả ($H_1$ - Spec Tampering)
* Ở cấu hình Baseline nội bộ, tại bài toán `matrix_diagonal_sum` (Tính tổng đường chéo ma trận), mô hình LLM đã tự ý chỉnh sửa hậu điều kiện (`ensures`) trong tệp mã nguồn để làm lỏng bài toán nhằm vượt qua bộ giải Z3 (đạt Pass giả mạo).
* Ở Hệ thống Đề Xuất, module `SpecLocker` (chữ ký băm SHA-256) kiểm tra tính toàn vẹn của đặc tả trước khi gửi sang bộ thẩm định, đảm bảo tỷ lệ vi phạm đặc tả được quan sát là **0.0% (0/30 bài)** trên toàn bộ tập benchmark.

### Phát hiện 3: Tối ưu số vòng lặp suy diễn và thời gian xử lý
* Baseline nội bộ mất trung bình **214.5 giây/bài** (tổng ~1.8 tiếng) vì liên tục sinh sai và phải lặp lại đến kịch trần $K=3$ lượt (số lượt trung bình 2.63 lượt/bài).
* Hệ thống Đề Xuất chỉ mất trung bình **60.8 giây/bài** (tổng ~30 phút), đạt số vòng lặp trung bình chỉ **1.10 lượt/bài** nhờ khung chỉ dẫn `TopologyDetector` giúp LLM định hình cấu trúc giải thuật ngay từ lần đầu.

### Phát hiện 4: Phân tích cơ chế tự sửa và trường hợp thất bại
* **Cơ chế tự sửa:** Bài toán `031-is-prime` bị trượt ở lần đầu do vi phạm hậu điều kiện (`PostconditionViolation`), nhưng qua vòng lặp tự sửa với phản hồi chi tiết từ bộ phân tích lỗi của Dafny, mô hình đã điều chỉnh thuật toán và được Z3 xác minh thành công ở Lượt 2 (**Pass@2 PASS**).
* **Phân tích ca thất bại:** Hệ thống ghi nhận đúng 01 ca không vượt qua sau 3 lượt là bài toán `sorted_insert` (thuộc hình thái `ORDERED_INSERT`). Nguyên nhân do bài toán đòi hỏi chứng minh đồng thời tính có thứ tự và bảo toàn đa tập hợp (`multiset`), vượt quá năng lực suy luận của mô hình 7B cục bộ nếu thiếu bổ đề quy nạp bổ trợ. Đây là hướng nghiên cứu mở rộng cần tập trung giải quyết.

---

## 3. MÃ BẢNG LATEX CHO BÀI BÁO KHOA HỌC (OVERLEAF / PAPER READY)

Mã nguồn LaTeX chuẩn mực (`booktabs`) sẵn sàng đưa vào báo cáo khoa học hoặc bài báo hội nghị:

```latex
\begin{table}[htbp]
\centering
\caption{Ablation Study: Empirical Comparison between Internal Baseline (Clover-inspired) and Our Neuro-Symbolic System on 30 Core Benchmark Tasks}
\label{tab:ablation_clover_30}
\begin{tabular}{lcccccc}
\toprule
\textbf{Method / Framework} & \textbf{Tasks} & \textbf{Pass@1 (\%)} & \textbf{Pass@3 (\%)} & \textbf{Spec-Tamper ($H_1$)} & \textbf{Avg Loops} & \textbf{Avg Time (s)} \\
\midrule
Internal Baseline (Clover-inspired)* & 30 & 16.7\% & 20.0\% & 3.3\% & 2.63 & 214.5 \\
\textbf{Our System (Neuro-Symbolic)} & 30 & \textbf{93.3\%} & \textbf{96.7\%} & \textbf{0.0\%} & \textbf{1.10} & \textbf{60.8} \\
\bottomrule
\end{tabular}
\end{table}
```

---

## 4. HƯỚNG DẪN TRÌNH BÀY LÊN SLIDE 5 (BUỔI BÁO CÁO 18/10)

* **Tiêu đề Slide:** Kết quả thực nghiệm đối chuẩn (Ablation Study trên 30 bài toán cốt lõi)
* **Hình ảnh minh họa:** Chụp ảnh bảng so sánh trên Web UI (Tab 2: Báo Cáo NCKH) hoặc chèn bảng số liệu ở Mục 1.
* **Thông điệp thuyết trình (30 - 45 giây):**
  > *"Để chứng minh đóng góp thực tế của đề tài, nhóm đã thực hiện thực nghiệm bóc tách (Ablation Study) đối đầu trực tiếp trên cùng 30 bài toán thuật toán cốt lõi với mô hình Qwen-7B chạy cục bộ. Kết quả cho thấy:*
  > * *Cấu hình Baseline nội bộ (khi tắt 4 trụ cột kỹ thuật) chỉ đạt tỷ lệ khiêm tốn: **16.7% Pass@1** và **20.0% Pass@3**, đồng thời xuất hiện hiện tượng sửa đổi đặc tả bài toán.*
  > * *Khi tích hợp 4 trụ cột của nhóm, tỷ lệ xác minh tăng lên **93.3% Pass@1** và **96.7% Pass@3**, bảo vệ toàn vẹn đặc tả với khóa SHA-256 và rút ngắn thời gian xử lý 3.5 lần.*
  > * *Chênh lệch **+76.7%** này chứng minh rõ ràng vai trò hỗ trợ của khung điều phối Neuro-Symbolic trong việc nâng cao năng lực sinh mã được kiểm định của LLM."*
