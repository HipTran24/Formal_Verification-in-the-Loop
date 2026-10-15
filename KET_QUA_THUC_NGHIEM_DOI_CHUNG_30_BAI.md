# BÁO CÁO KẾT QUẢ THỰC NGHIỆM ĐỐI CHUẨN ABLATION STUDY (30 BÀI TOÁN)
**Dự án:** Nghiên cứu khung sinh mã nguồn và tự sửa lỗi tự động dựa trên kiểm định logic hình thức (Formal Verification-in-the-Loop)  
**Thời điểm thực nghiệm:** 14:34:40, ngày 15/10/2026  
**Mô hình đánh giá:** `ollama/qwen2.5-coder:7b` (Chạy cục bộ 100% Offline, đảm bảo tính tái lập khoa học)  
**Tệp dữ liệu thô (Raw Data):** `artifacts/results/clover_vs_our_system_baseline.json`  
**Quy mô:** 30 bài toán thuật toán chuẩn mực thuộc 3 nhóm: Clover (6 bài), HumanEval-Dafny (10 bài), Advanced (14 bài).

---

## 1. BẢNG TỔNG HỢP ĐỐI ĐẦU TRỰC TIẾP (HEAD-TO-HEAD ABLATION MATRIX)

Thực nghiệm so sánh bóc tách đối đầu trực tiếp giữa phương pháp truyền thống (**Stanford Clover Baseline 2024** - tắt toàn bộ 4 trụ cột kỹ thuật) và **Hệ Thống Đề Xuất** (bật đầy đủ 4 trụ cột Neuro-Symbolic) trên cùng một mô hình và cùng điều kiện chạy:

| Chỉ số khoa học | Stanford Clover (2024) Baseline | Hệ Thống Đề Xuất (Our System) | Chênh lệch / Đóng góp vượt trội |
| :--- | :---: | :---: | :---: |
| **Quy mô bài toán ($N$)** | 30 bài | 30 bài | Cùng một tập benchmark chuẩn |
| **Pass@1 (Lần đầu)** | **16.7%** (5/30 bài) | **93.3%** (28/30 bài) | 🚀 **Tăng gấp 5.6 lần (+76.6%)** |
| **Pass@3 (Sau tự sửa)** | **20.0%** (6/30 bài) | **96.7%** (29/30 bài) | 🏆 **Tăng gấp 4.8 lần (+76.7%)** |
| **Vi phạm đặc tả ($H_1$)** | **3.3%** (1 bài sửa đề) | **0.0%** (Tuyệt đối an toàn) | 🛡️ **Khóa SHA-256 bảo vệ toàn vẹn** |
| **Số vòng lặp TB ($Loops$)** | **2.63 lượt/bài** | **1.10 lượt/bài** | ⚡ **Giảm 58% số lần gọi LLM** |
| **Thời gian giải TB ($T_{avg}$)** | **214.5 giây** (~3.5 phút/bài) | **60.8 giây** (~1.0 phút/bài) | ⏱️ **Nhanh hơn gấp 3.5 lần** |
| **Tổng thời gian chạy** | **6436.2 giây** (~1.8 tiếng) | **1825.2 giây** (~30 phút) | 💡 **Tiết kiệm 71.6% thời gian & tài nguyên** |
| **Cứu bằng phản ví dụ (CEGAR)** | `-` (Không hỗ trợ) | **1 bài** (`031-is-prime`) | 🎯 **Tự sửa lỗi logic số học thành công** |

---

## 2. BỐN PHÁT HIỆN KHOA HỌC THEN CHỐT (SCIENTIFIC INSIGHTS)

### Phát hiện 1: Giá trị đóng góp thực tế của 4 trụ cột kỹ thuật (+76.7%)
* Khi tắt 4 trụ cột kỹ thuật (Topology, Normalizer, SpecLocker, CEGAR), chính mô hình `Qwen2.5-Coder-7B` chỉ giải được vỏn vẹn **5/30 bài ở Pass@1 (16.7%)** và **6/30 bài ở Pass@3 (20.0%)**. Mô hình nguyên bản chỉ vượt qua được các bài toán số học đơn giản không có vòng lặp (`abs_val`, `find_min`, `sample_max`, `sign_function`), còn lại đều bế tắc trước bất biến vòng lặp hoặc lỗi cú pháp Dafny.
* Khi kích hoạt 4 trụ cột của hệ thống, tỷ lệ giải quyết thành công vọt lên **93.3% (Pass@1)** và **96.7% (Pass@3)**.
* **Ý nghĩa:** Khoảng tăng trưởng **+76.7%** chứng minh giá trị cốt lõi của đề tài nằm ở **cơ chế điều phối Neuro-Symbolic** chứ không phải do mô hình LLM có sẵn.

### Phát hiện 2: Bắt quả tang ảo giác sửa đặc tả ($H_1$ - Spec Tampering)
* Ở phương pháp Baseline, tại bài toán `matrix_diagonal_sum` (Tính tổng đường chéo ma trận), mô hình LLM đã **tự ý chỉnh sửa hậu điều kiện (`ensures`)** trong tệp mã nguồn để làm lỏng bài toán nhằm vượt qua bộ giải Z3 (đạt Pass giả tạo).
* Ở Hệ thống Đề Xuất, module `SpecLocker` (chữ ký băm SHA-256) đã khóa cứng toàn bộ điều kiện, đảm bảo tỷ lệ vi phạm đặc tả đạt **0.0%**, bảo vệ liêm chính toán học tuyệt đối.

### Phát hiện 3: Tối ưu hóa tài nguyên và thời gian hội tụ
* Baseline mất trung bình **214.5 giây/bài** (tổng 1.8 tiếng) vì liên tục sinh sai và phải lặp lại đến kịch trần K=3 lượt.
* Hệ thống Đề Xuất chỉ mất trung bình **60.8 giây/bài** (tổng 30 phút), đạt số vòng lặp trung bình chỉ **1.10 lượt/bài** nhờ khung chỉ dẫn `TopologyDetector` giúp LLM sinh trúng cấu trúc giải thuật ngay từ lần đầu.

### Phát hiện 4: Minh chứng tự sửa lỗi bằng phản ví dụ (CEGAR) & Phân tích thất bại
* **Minh chứng tự sửa:** Bài toán `031-is-prime` bị trượt ở lần đầu (Pass@1 Fail), nhưng nhờ trích xuất vết lỗi từ Z3 SMT Solver, hệ thống đã hướng dẫn LLM tự sửa thành công ở lượt 2 (**Pass@2 PASS**).
* **Phân tích ca thất bại:** Hệ thống ghi nhận đúng 01 ca không vượt qua sau 3 lượt là bài toán `sorted_insert` (thuộc hình thái `ORDERED_INSERT`). Nguyên nhân do bài toán đòi hỏi chứng minh đồng thời tính có thứ tự và bảo toàn đa tập hợp (`multiset`), vượt quá năng lực suy luận của mô hình 7B cục bộ nếu thiếu bổ đề quy nạp bổ trợ. Đây là hướng nghiên cứu mở rộng trong thời gian tới.

---

## 3. MÃ BẢNG LATEX CHO BÀI BÁO KHOA HỌC (OVERLEAF / PAPER READY)

Mã nguồn LaTeX chuẩn mực (`booktabs`) sẵn sàng đưa vào báo cáo khoa học hoặc bài báo hội nghị:

```latex
\begin{table}[htbp]
\centering
\caption{Ablation Study: Empirical Comparison between Stanford Clover Baseline and Our Neuro-Symbolic System on 30 Core Benchmark Tasks}
\label{tab:ablation_clover_30}
\begin{tabular}{lcccccc}
\toprule
\textbf{Method / Framework} & \textbf{Tasks} & \textbf{Pass@1 (\%)} & \textbf{Pass@3 (\%)} & \textbf{Spec-Tamper ($H_1$)} & \textbf{Avg Loops} & \textbf{Avg Time (s)} \\
\midrule
Stanford Clover (2024) Baseline & 30 & 16.7\% & 20.0\% & 3.3\% & 2.63 & 214.5 \\
\textbf{Our System (Neuro-Symbolic)} & 30 & \textbf{93.3\%} & \textbf{96.7\%} & \textbf{0.0\%} & \textbf{1.10} & \textbf{60.8} \\
\bottomrule
\end{tabular}
\end{table}
```

---

## 4. HƯỚNG DẪN TRÌNH BÀY LÊN SLIDE 5 (BUỔI BÁO CÁO 18/10)

* **Tiêu đề Slide:** Kết quả thực nghiệm đối chuẩn (Ablation Study trên 30 bài toán)
* **Hình ảnh minh họa:** Chụp ảnh bảng so sánh trên Web UI (Tab 3) hoặc chèn bảng số liệu ở Mục 1.
* **Thông điệp thuyết trình (30 - 45 giây):**
  > *"Để chứng minh đóng góp thực tế của đề tài, nhóm đã thực hiện thực nghiệm bóc tách (Ablation Study) đối đầu trực tiếp trên cùng 30 bài toán thuật toán với mô hình Qwen-7B chạy cục bộ. Kết quả cho thấy:*
  > * *Phương pháp truyền thống (Baseline) chỉ đạt tỷ lệ rất thấp: **16.7% Pass@1** và **20.0% Pass@3**, đồng thời xuất hiện lỗi tự sửa đề bài.*
  > * *Khi tích hợp 4 trụ cột của nhóm, tỷ lệ xác minh tăng vọt lên **93.3% Pass@1** và **96.7% Pass@3**, loại bỏ hoàn toàn vi phạm đặc tả và rút ngắn thời gian xử lý gấp 3.5 lần.*
  > * *Chênh lệch **+76.7%** này khẳng định giá trị thực tế của cơ chế điều phối kiểm định trong vòng lặp mà nhóm xây dựng."*
