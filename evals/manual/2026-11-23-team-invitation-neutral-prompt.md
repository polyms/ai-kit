# Neutral Team Invitation evaluation prompt

**Origin:** This text was drafted in the conversation by the evaluator assistant on 2026-11-23, then reused as the neutral prompt for the unassisted and AI Kit-assisted runs **as confirmed by the user**. This is an exact prompt-text fixture, not a model execution or tool trace.

## Exact prompt to send in both arms

Tôi cần lập kế hoạch triển khai tính năng **Team Invitation**.

**Requirements đã phê duyệt:**
- BR-01: Chỉ Owner được gửi lời mời.
- AC-01: Email hợp lệ tạo pending invitation.
- AC-02: Email không hợp lệ hiển thị lỗi và không tạo invitation.
- AC-03: Non-owner không được gửi lời mời.

**Bối cảnh:**
- Team có 2 developers.
- Resend và expiry ngoài scope.
- Không có historical velocity hoặc actual effort.
- Chưa có delivery commitment.

**Yêu cầu:**
1. Estimate effort theo developer-days, nêu assumptions, dependencies và uncertainty.
2. Viết implementation tasks có ID, dependencies, effort và acceptance.
3. Viết positive, negative, authorization và API/backend test cases.
4. Giữ nguyên approved requirements và traceability.
5. Áp dụng thông tin đã có, không hỏi lại dữ liệu được cung cấp.
6. Chỉ sử dụng historical effort khi có nguồn xác minh phù hợp.
7. Không suy diễn delivery date từ số developers.
8. Chỉ tạo draft, không publish, không thay đổi dữ liệu bên ngoài.

Cuối câu trả lời, ghi rõ các tools, nguồn tham khảo và dữ liệu lịch sử thực sự đã truy xuất nếu có. Không tuyên bố đã thực hiện hành động hay kiểm thử khi chưa thực hiện.

## Manual pair configuration and provenance

- **Prompt identity:** User-confirmed same neutral prompt, authored above, not a reconstruction inferred from output alone.
- **Arm A (baseline):** user-submitted 133-line planning draft; its own audit says no AI Kit MCP.
- **Arm B (assisted):** user-submitted 146-line planning draft; its own audit lists four AI Kit MCP calls using `plan`, `task`, `qa`.
- **Host:** The user was testing ChatGPT Instant, but archived host-level mode and runtime settings are not independently verified from the Markdown files.
- **Only intended experimental variable:** AI Kit connection/use. Possible tool availability and context contamination are not independently audited.
- **Repeatability:** one sample per arm; a user-confirmed same-prompt *manual comparison*, not repeated randomized trials or an independently controlled provider benchmark.
- **Measured resources:** no trusted wall-clock latency, token usage, full wire trace or actual QA execution receipts.

The earlier 225-line post-merge Instant output with an **AI Kit-specific prompt** is separate regression evidence, not part of this neutral-prompt pair.
