# AI-assisted feedback / Góp ý ngay trong AI client

Give AI Kit feedback **through your AI conversation**. AI Kit helps you clarify
and prepare a public GitHub Issue, using its `prepare_feedback_issue` MCP tool.
You do not need to fill a blank form, run a benchmark or export tool traces.

Example prompt:

> Tôi muốn góp ý AI Kit: skill plan hỏi lại số developers dù tôi đã nói trước đó.

## Workflow

1. **Describe:** Say what worked or what was confusing. The AI reuses the
   relevant context already provided and asks a short follow-up only if needed.
2. **Draft:** The AI calls `prepare_feedback_issue`. It returns a complete
   issue title, category, Markdown body and fixed destination `polyms/ai-kit`.
3. **Approve:** The AI shows you the exact PUBLIC title/body. Review it, edit
   or redact anything sensitive, and explicitly say whether to publish.
4. **Create:** With your approval, the AI calls the host's **connected GitHub
   `create_issue` action** using your GitHub authorization, then shares the
   real issue URL/number after successful creation.
5. **Fallback:** Without a connected GitHub write integration, the AI gives
   you a **prefilled GitHub Issue link** with the title/body already filled.
   You review and submit. The form opens with a prefilled title, feedback and
   available optional fields; GitHub still asks you to confirm public
   submission and may ask you to select the category. For a very long draft,
   the link uses a **clearly marked shortened excerpt**; the complete draft
   remains in the AI conversation.

GitHub Issues are public. Avoid private conversations, client/customer data,
proprietary source, internal prompts, credentials or access tokens.
AI Kit's draft tool performs only **best-effort detection of obvious secrets**.
It cannot guarantee a draft is safe. Read the full content before publishing.

**Authentication boundary:** The AI Kit OAuth account is *not* a GitHub
authorization. The MCP draft tool cannot create an issue on its own. To
publish from inside the AI chat, the host needs its own authenticated
GitHub connector/MCP with **Issues write access to the target
`polyms/ai-kit` repository**. A connector linked to a user's GitHub
account may still lack access to this repository. If GitHub returns an
authorization or creation error, the assistant should state the failure,
**not retry or claim success**, and offer the prefilled fallback.
No shared server token is used.
Neither a successful draft nor an approval message proves the issue was
created. Only a real GitHub response confirms publication.

The AI Kit maintainer reviews submitted issues and decides whether and
when to act. No automatic bug fix or skill edit happens on feedback.

## Knowledge contributions (optional)

When a user voluntarily wants to share a verified, reusable technical lesson, use the same
`prepare_feedback_issue` tool with `category: "knowledge"`, `description` for proposed guidance,
and `knowledge: { intent, disposition, applicability, evidence, overlap, target? }`. Intent is
`incident`, `design` or `toolchain`; disposition is `new` or `update` (live target ID/slug required
for updates). Include stack/versions, sanitized provenance and verification, and actual overlap
findings or explicitly unverified overlap. No raw logs or private context. Start contribution-specific searches and draft tools only after
the user chooses to contribute, not as a skill completion gate. The tool returns a
`[Knowledge][intent]` issue draft and a prefilled form under Knowledge contribution. Review and
approve the exact public draft before GitHub submission; the existing fallback applies. This is
an intake queue only: the maintainer independently reviews, checks identities and decides whether
to publish in Knowledge CMS using existing admin authorization. No CMS write, admin credential,
skill change, or compulsory reflection is required of the contributor.

## Tiếng Việt

Chỉ cần nói với AI bạn muốn góp ý điều gì về AI Kit. AI Kit sẽ hỗ trợ
làm rõ, **tạo bản nháp GitHub Issue đúng cấu trúc**, cho bạn xem và duyệt.
Nếu AI client có GitHub connector được cấp quyền, AI sẽ **tạo Issue giúp bạn**
sau khi bạn đồng ý. Nếu chưa kết nối GitHub, AI cung cấp liên kết
**đã điền sẵn tiêu đề và nội dung** để bạn xác nhận trên GitHub.
Với nội dung quá dài, link sử dụng bản tóm lược có thông báo rõ;
bản đầy đủ vẫn có trong cuộc hội thoại. Bạn vẫn cần xác nhận công khai
và có thể cần chọn loại góp ý trên GitHub.

Đây là phản hồi tự nguyện, không bắt người dùng chạy benchmark, xuất log
hay thu thập hội thoại riêng tư. Issue trên GitHub là công khai.
