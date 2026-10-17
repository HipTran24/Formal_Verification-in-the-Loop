"""Streamlit browser and single-case runner for the new research suites."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import streamlit as st
from dotenv import load_dotenv
from web_demo.icons import icon_heading


ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "artifacts" / "results" / "new_benchmarks"
SUITES = ("DafnyBench20", "Python pilot", "Spec traps")


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _report_path(suite: str, case_id: str, mode: str = "") -> Path:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    slug = f"{suite}_{case_id}_{mode}_{stamp}" if mode else f"{suite}_{case_id}_{stamp}"
    return RESULTS / f"{slug}.json"


def _execute(command: list[str], output: Path, *, timeout: int) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    try:
        with st.spinner("Đang chạy bài thử. Kết quả sẽ được lưu thành báo cáo JSON…"):
            proc = subprocess.run(
                command, cwd=ROOT, text=True, capture_output=True, timeout=timeout,
                env=os.environ.copy(),
            )
    except subprocess.TimeoutExpired:
        st.error(f"Hết thời gian chờ sau {timeout} giây. Bài này chưa có kết luận.")
        return
    except OSError as exc:
        st.error(f"Không khởi động được bộ chạy: {exc}")
        return
    if proc.returncode:
        st.error(f"Bộ chạy kết thúc với mã {proc.returncode}.")
        with st.expander("Chi tiết lỗi", expanded=True):
            st.code((proc.stdout + proc.stderr)[-5000:] or "Không có thông báo.", language="text")
        return
    if not output.is_file():
        st.error("Bộ chạy hoàn tất nhưng không tạo báo cáo.")
        return
    st.success("Đã chạy xong và lưu báo cáo.")
    st.session_state["new_benchmark_latest"] = str(output)


def _show_report(report: dict, suite: str) -> None:
    if suite == "Spec traps":
        c1, c2, c3 = st.columns(3)
        c1.metric("Sửa hoặc né đặc tả bị chặn", report.get("tamper_or_bypass_rejected", 0))
        c2.metric("Đặc tả yếu cần rà soát", report.get("weak_specs_requiring_review", 0))
        c3.metric("Phản ví dụ quan sát được", report.get("weak_spec_counterexamples", 0))
        st.dataframe([
            {
                "Ca": row["id"], "Loại": row["kind"],
                "Khóa hợp đồng": row["contract_gate"],
                "Dafny": row["dafny_verification"],
                "Audit": row["dafny_audit"],
                "Phản ví dụ": row["semantic_witness"],
            }
            for row in report.get("results", [])
        ], width="stretch", hide_index=True)
        for row in report.get("results", []):
            with st.expander(f"{row['id']} · phản hồi chi tiết"):
                st.write(row.get("reason") or "Kiểm tra sửa hợp đồng hoặc né chứng minh.")
                if row.get("contract_issues"):
                    st.write("Vấn đề hợp đồng:", row["contract_issues"])
                if row.get("dafny_output"):
                    st.code(row["dafny_output"], language="text")
                if row.get("audit_output"):
                    st.code(row["audit_output"], language="text")
                if row.get("witness_output"):
                    st.code(row["witness_output"], language="text")
        return

    if suite == "DafnyBench20":
        rows = report.get("results", [])
        passed = sum(row.get("status") == "passed" for row in rows)
        c1, c2, c3 = st.columns(3)
        c1.metric("Đã chạy", len(rows))
        c2.metric("Verify + audit đạt", passed)
        c3.metric("Chưa đạt", len(rows) - passed)
        st.dataframe([
            {"Bài": row.get("task_id"), "Kết quả": row.get("status"),
             "Số lượt": len(row.get("attempts", [])),
             "Thời gian (s)": round(row.get("elapsed_seconds", 0), 1)}
            for row in rows
        ], width="stretch", hide_index=True)
        for row in rows:
            with st.expander(f"{row.get('task_id')} · từng lượt chứng minh"):
                for attempt in row.get("attempts", []):
                    st.write(f"Lượt {attempt['number']}: **{attempt['status']}**")
                    if attempt.get("strict_contract_issues"):
                        st.write("Vấn đề hợp đồng:", attempt["strict_contract_issues"])
                    if attempt.get("dafny_output"):
                        st.code(attempt["dafny_output"], language="text")
                    if attempt.get("audit_output"):
                        st.code(attempt["audit_output"], language="text")
        return

    c1, c2, c3 = st.columns(3)
    python_status = report.get("python_tests", {}).get("status", "unknown")
    c1.metric("Bài kiểm tra Python", python_status)
    c2.metric("Dafny", report.get("dafny_verification", {}).get("status", "unknown"))
    c3.metric("Rà soát đặc tả", report.get("spec_audit", {}).get("status", "unknown"))
    if python_status == "passed":
        st.success("Bản vá vượt bài kiểm tra Python của bộ chấm.")
    elif python_status == "failed":
        st.error("Bản vá chưa vượt bài kiểm tra Python.")
    elif python_status == "pending_swebench_harness":
        st.warning("Đã tạo bản vá, nhưng chưa chấm bằng bộ kiểm tra Docker của SWE-bench.")
    elif python_status in {"harness_error", "unavailable", "timeout", "not_run"}:
        st.warning("Chưa có kết luận về bản vá Python; xem trạng thái bộ chấm trong báo cáo.")
    if report.get("formal_review_status") == "draft_pending_human_review":
        st.info("Đặc tả Dafny của issue này đang là bản nháp. Không coi bản vá Python đã được chứng minh hình thức.")
    st.caption(
        f"Chế độ: {report.get('mode', 'framework')} · "
        f"Mô hình: {report.get('model', '—')} · "
        f"Thời gian: {round(report.get('elapsed_seconds', 0), 1)} giây"
    )
    attempts = report.get("attempts", [])
    if attempts:
        st.dataframe([
            {"Lượt": row.get("number"), "Bản vá": row.get("patch_status", "—"),
             "Cú pháp": row.get("syntax_check", {}).get("status", "—"),
             "Tệp sửa": ", ".join(row.get("changed_paths", [])) or "—",
             "Lỗi": row.get("error", "")}
            for row in attempts
        ], width="stretch", hide_index=True)
        with st.expander("Bằng chứng context đã gửi cho agent"):
            st.json([row.get("context", {}) for row in attempts])
    if report.get("failure_reason"):
        st.error(f"Lý do dừng: {report['failure_reason']}")
    if report.get("final_patch"):
        with st.expander("Xem bản vá cuối cùng"):
            st.code(report["final_patch"], language="diff")
    if report.get("python_tests", {}).get("output_tail"):
        with st.expander("Đầu ra bộ chấm SWE-bench"):
            st.code(report["python_tests"]["output_tail"], language="text")


def _saved_reports(prefix: str, suite: str) -> None:
    files = sorted(RESULTS.glob(f"{prefix}*.json"), reverse=True) if RESULTS.is_dir() else []
    if suite == "Spec traps" and RESULTS.is_dir():
        files = sorted(set(files) | set(RESULTS.glob("spec_traps_all_*.json")), reverse=True)
    if not files:
        st.caption("Chưa có kết quả cho lựa chọn này. Bấm Chạy để tạo báo cáo đầu tiên.")
        return
    latest = st.session_state.get("new_benchmark_latest")
    initial = next((i for i, path in enumerate(files) if str(path) == latest), 0)
    chosen = st.selectbox("Báo cáo đã lưu", files, index=initial,
                          format_func=lambda path: path.stem, key=f"saved_{prefix}")
    try:
        report = _load_json(chosen)
    except (OSError, json.JSONDecodeError) as exc:
        st.error(f"Không đọc được báo cáo: {exc}")
        return
    _show_report(report, suite)
    st.download_button("Tải báo cáo JSON", chosen.read_bytes(), icon=":material/download:",
                       file_name=chosen.name, mime="application/json", key=f"download_{prefix}")


def _docker_available() -> bool:
    if not shutil.which("docker") or not shutil.which("swebench"):
        return False
    try:
        return subprocess.run(["docker", "info"], capture_output=True, timeout=8).returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        return False


def render_new_benchmarks_tab() -> None:
    """Browse pinned cases, run one case, and inspect separated evidence."""
    load_dotenv(ROOT / ".env")
    st.markdown(icon_heading("Bộ thử nghiệm mới", "flask"), unsafe_allow_html=True)
    st.caption("Khám phá từng case và chạy trực tiếp. 35 bài Dafny cũ vẫn ở các tab trước.")
    counts = st.columns(3)
    counts[0].metric("DafnyBench", "20 bài")
    counts[1].metric("Issue Python", "30 bài")
    counts[2].metric("Bẫy đặc tả", "10 ca")

    suite = st.radio("Nhóm bài thử", SUITES, horizontal=True, key="new_benchmark_suite")
    command = [sys.executable]
    prefix = ""
    case_id = ""
    grade = False
    mode = ""

    if suite == "DafnyBench20":
        entries = _load_json(ROOT / "data/benchmarks/dafnybench20/index.json")["tasks"]
        lookup = {entry["id"]: entry for entry in entries}
        case_id = st.selectbox("Chọn bài chứng minh", list(lookup), key="new_dafny_case")
        selected = lookup[case_id]
        st.caption("Agent chỉ được thêm invariant, decreases, assert hoặc reveal. Dafny verify và audit chấm kết quả.")
        with st.expander("Xem mã Dafny cần bổ sung chứng minh"):
            st.code((ROOT / "data/benchmarks/dafnybench20" / selected["file"]).read_text(encoding="utf-8"),
                    language="dafny")
        prefix = f"dafnybench20_{case_id}_"
        command += ["-m", "experiments.run_dafnybench20", "--task", case_id]
    elif suite == "Python pilot":
        index = _load_json(ROOT / "data/benchmarks/python_projects/index.json")
        case_id = st.selectbox("Chọn issue Python", index["tasks"], key="new_python_case")
        manifest = ROOT / "data/benchmarks/python_projects" / f"{case_id}.json"
        task = _load_json(manifest)
        st.caption(f"Kho: {task['repo']['url']} · Loại: {task['category']} · Commit gốc: {task['repo']['base_commit'][:12]}")
        st.text_area("Nội dung issue", value=task["issue"], height=220, disabled=True,
                     key=f"new_issue_{case_id}")
        if task.get("formal_review_status") != "reviewed":
            st.info("Đặc tả Dafny của issue này chưa được duyệt; kết quả Python và Dafny được báo riêng.")
        baseline = st.checkbox("Chạy baseline (không phản hồi kiểm tra cho agent)", key="new_python_baseline")
        mode = "baseline" if baseline else "framework"
        grade = st.checkbox("Chấm bản vá bằng Docker/SWE-bench sau khi tạo", key="new_python_grade")
        pinned_dataset = ROOT / "artifacts/private/swebench_verified_pinned30.jsonl"
        dataset = (str(pinned_dataset) if pinned_dataset.is_file() else "verified")
        if grade:
            dataset = st.text_input("Dataset dùng để chấm", value=dataset, key="new_python_dataset")
            task_repo = st.text_input("Thư mục task repo SWE-bench (tùy chọn trên macOS ARM)",
                                      key="new_python_task_repo")
        prefix = f"python_pilot_{case_id}_"
        command += ["-m", "experiments.run_project_task", str(manifest)]
        if baseline:
            command.append("--baseline")
        if grade:
            command += ["--swebench-eval", "--swebench-dataset", dataset]
            if task_repo.strip():
                command += ["--swebench-task-repo", task_repo.strip()]
    else:
        cases = _load_json(ROOT / "data/benchmarks/spec_traps/cases.json")["cases"]
        lookup = {case["id"]: case for case in cases}
        case_id = st.selectbox("Chọn ca đặc tả", list(lookup), key="new_trap_case")
        selected = lookup[case_id]
        st.caption(f"Loại: {selected['kind']} · {selected.get('reason', 'Kiểm tra sửa hợp đồng hoặc né chứng minh.')}")
        original = ((ROOT / selected["original_file"]).read_text(encoding="utf-8")
                    if "original_file" in selected else selected["original"])
        with st.expander("Xem hợp đồng gốc và mã thử"):
            st.markdown("**Hợp đồng gốc**")
            st.code(original, language="dafny")
            st.markdown("**Mã đưa vào kiểm tra**")
            st.code(selected["candidate"], language="dafny")
            if selected.get("witness"):
                st.markdown("**Phản ví dụ kiểm tra ngữ nghĩa**")
                st.code(selected["witness"], language="dafny")
        prefix = f"spec_traps_{case_id}_"
        command += ["-m", "experiments.run_spec_traps", "--case", case_id]

    if suite != "Spec traps":
        model = st.text_input("Mô hình LiteLLM", value=os.getenv("FVIL_BENCHMARK_MODEL", ""),
                              placeholder="Ví dụ: openai/tên-mô-hình", key="new_benchmark_model",
                              help="Dùng tên mô hình và API key tương ứng trong .env; không bắt buộc Ollama.")
        attempts = st.number_input("Số lượt sửa tối đa", min_value=1, max_value=5, value=3,
                                   key="new_benchmark_attempts")
        command += ["--model", model.strip(), "--max-attempts", str(attempts)]
        st.caption("Chạy mô hình có thể phát sinh chi phí API. Mỗi lần bấm tạo một báo cáo mới.")

    run_one = st.button("Chạy case đã chọn", icon=":material/play_arrow:", type="primary", key="new_benchmark_run")
    run_all_traps = (st.button("Chạy cả 10 ca", icon=":material/play_arrow:", key="new_traps_all")
                     if suite == "Spec traps" else False)
    if run_one or run_all_traps:
        if suite != "Spec traps" and not model.strip():
            st.warning("Hãy nhập tên mô hình LiteLLM trước khi chạy.")
        elif grade and not _docker_available():
            st.error("Muốn chấm Python cần cài CLI `swebench` và khởi động Docker trước.")
        else:
            if run_all_traps:
                command = [sys.executable, "-m", "experiments.run_spec_traps"]
            report_case = "all" if run_all_traps else case_id
            report_suite = {"DafnyBench20": "dafnybench20", "Python pilot": "python_pilot",
                            "Spec traps": "spec_traps"}[suite]
            output = _report_path(report_suite, report_case, mode)
            command += ["--output", str(output)]
            _execute(command, output, timeout=7800 if grade else 1800)
            if output.is_file():
                st.session_state[f"saved_{prefix}"] = output

    st.markdown("#### Kết quả")
    _saved_reports(prefix, suite)
    st.caption("Chi tiết quy trình và giới hạn chứng minh: docs/REAL_WORLD_BENCHMARKS.md")
