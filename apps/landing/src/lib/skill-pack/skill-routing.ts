import type { SkillPackName } from './skill-pack'

/** Routing hints are advisory. Clients interpret user intent; no server-side model or keyword gate. */
export type SkillRoutingHint = {
  useWhen: readonly string[]
  avoidWhen: string
  relatedSkills: readonly SkillPackName[]
  starter: 'entry' | 'primary'
}

export const SKILL_ROUTING: Record<SkillPackName, SkillRoutingHint> = {
  'code-review': {
    useWhen: ['Review source code, a commit, PR or diff for Standards, Spec and Simplify', 'Review PR, rà soát mã nguồn, kiểm tra diff trước merge'],
    avoidWhen: 'Review of requirements, proposals, business documents or plans belongs to review. Do not implement fixes or merge unless separately authorized.',
    relatedSkills: ['dev', 'arch', 'reqs', 'qa'],
    starter: 'entry',
  },
  'align': {
    useWhen: ['Resolve design-tree decisions and terminology', 'Chốt hướng, làm rõ thuật ngữ'],
    avoidWhen: 'Do not repeat approved alignment or write a PRD here.',
    relatedSkills: ['reqs', 'arch', 'track'],
    starter: 'entry',
  },
  'arch': {
    useWhen: ['Design module seams, assess architecture and deepening opportunities', 'Thiết kế module, rà soát kiến trúc'],
    avoidWhen: 'Do not implement a refactor merely from a report request.',
    relatedSkills: ['align', 'dev', 'code-review'],
    starter: 'entry',
  },
  'dev': {
    useWhen: ['Implement specs, fix bugs, prepare new features', 'Triển khai tính năng, sửa lỗi, tạo CRUD'],
    avoidWhen: 'Use devops for standalone infra incidents; do not invent scope or claim unrun tests.',
    relatedSkills: ['reqs', 'design', 'arch', 'qa', 'code-review', 'devops'],
    starter: 'entry',
  },
  'craft': {
    useWhen: ['/craft, write or audit SKILL.md', 'Viết skill, rà soát skill'],
    avoidWhen: 'Explicit selection; not general project setup.',
    relatedSkills: ['setup', 'review'],
    starter: 'entry',
  },
  'build-feature-map': {
    useWhen: ['/build-feature-map, build or update feature map', 'Dựng bản đồ vùng, cập nhật feature map'],
    avoidWhen: 'Explicit selection; not UI design or QA approval.',
    relatedSkills: ['setup', 'qa', 'design', 'dev'],
    starter: 'entry',
  },
  'devops': {
    useWhen: ['Investigate deployment or CI failure, diagnose infrastructure', 'Sửa deploy, lỗi build, fix CI'],
    avoidWhen: 'Not feature implementation or release readiness alone.',
    relatedSkills: ['release', 'code-review'],
    starter: 'entry',
  },
  'setup': {
    useWhen: ['/setup, configure project tools and execution profile', 'Cấu hình repo, nguồn dữ liệu và công cụ'],
    avoidWhen: 'Explicit invocation; do not run setup just to read existing project context.',
    relatedSkills: ['align', 'track'],
    starter: 'entry',
  },
  reqs: {
    useWhen: [
      'Define requirements, BRD, enterprise or lean PRD, or publish an aligned PRD when authorized',
      'Làm rõ yêu cầu, viết đặc tả nghiệp vụ',
      "Chốt phạm vi, nghiệp vụ, quyền và điều kiện nghiệm thu; dac ta yeu cau",
    ],
    avoidWhen: 'A known defect or standalone implementation ticket; do not rewrite approved requirements. Không viết lại yêu cầu đã duyệt hoặc thay cho ticket triển khai riêng.',
    relatedSkills: ['research', 'review', 'plan', 'task', 'qa'],
    starter: 'entry',
  },
  design: {
    useWhen: ['Specify UI flows, screens, states or audit a design', 'Thiết kế giao diện, rà soát UI',
      "Lên luồng màn hình, trạng thái giao diện; thiet ke UI",
    ],
    avoidWhen: 'Writing product requirements, implementing code or generating a new visual asset. Không dùng để viết nghiệp vụ, code hay tạo ảnh.',
    relatedSkills: ['reqs', 'review', 'qa'],
    starter: 'entry',
  },
  research: {
    useWhen: [
      'Investigate current evidence, compare technologies or competitors',
      'Nghiên cứu, so sánh giải pháp, kiểm chứng nguồn',
      "Tìm hiểu thị trường, xem nguồn mới, đối chiếu công nghệ; tim hieu",
    ],
    avoidWhen: 'A short factual answer needs no structured research; business decisions belong to business. Không cần cho câu hỏi đơn giản hoặc chỉ quyết định giá.',
    relatedSkills: ['business', 'reqs', 'review'],
    starter: 'primary',
  },
  business: {
    useWhen: [
      'Evaluate pricing, economics, feasibility or strategic options',
      'Tính giá, biên lợi nhuận, phân tích phương án',
      "Tính giá gói, chi phí, lợi nhuận; tinh gia goi nay",
    ],
    avoidWhen: 'Specify confirmed product behavior with reqs; use research for evidence gathering alone. Không dùng để estimate công dev hoặc chỉ thu thập nguồn.',
    relatedSkills: ['research', 'review', 'reqs', 'plan'],
    starter: 'primary',
  },
  docs: {
    useWhen: [
      'Draft standalone documentation, SOP, meeting notes or handover',
      'Viết tài liệu, biên bản, bàn giao',
      "Soạn hướng dẫn, biên bản, tài liệu bàn giao; viet tai lieu",
    ],
    avoidWhen: 'Use comms for short replies and reqs for requirements. Không dùng cho comment ngắn hoặc đặc tả yêu cầu.',
    relatedSkills: ['research', 'reqs', 'review', 'comms'],
    starter: 'entry',
  },
  task: {
    useWhen: [
      'Draft or create work items, including vertical slicing of approved PRDs',
      'Viết task, chia công việc, tạo ticket mới',
      "Soạn đầu việc có tiêu chí hoàn thành, tạo task mới; tao task",
    ],
    avoidWhen: 'Use bug for defects and track for updates to existing issues. Không dùng để đổi trạng thái ticket cũ hay báo lỗi.',
    relatedSkills: ['reqs', 'plan', 'qa', 'track'],
    starter: 'primary',
  },
  bug: {
    useWhen: [
      'Report an observed defect with expected and actual behavior',
      'Log bug, báo lỗi, ghi nhận regression',
      "Ghi nhận lỗi thực tế, hiện trạng và kết quả mong đợi; bao loi",
    ],
    avoidWhen: 'Use task for enhancements. A reported symptom is sufficient for a draft; never invent reproduction. Không dùng cho cải tiến; có thể draft lỗi được báo dù chưa có log.',
    relatedSkills: ['qa', 'track', 'task'],
    starter: 'primary',
  },
  track: {
    useWhen: [
      'Inspect, update or triage issues and external PRs using configured roles',
      'Check ticket, assign hàng loạt, cập nhật deadline, thống kê backlog',
      "Check giúp a ticket quá hạn, đổi assignee; check ticket qua han",
    ],
    avoidWhen: 'Use task or bug to create new work; use comms for reply text alone. Checking existing records or posting an authorized comment requires tracker access. Không tự tạo ticket mới.',
    relatedSkills: ['task', 'bug', 'comms', 'plan'],
    starter: 'primary',
  },
  plan: {
    useWhen: [
      'Estimate effort, capacity, dependencies and milestones',
      'Estimate man-days, chia phase, lập tiến độ',
      "Chia phase cho 2 dev, ước lượng ngày công; uoc luong effort",
    ],
    avoidWhen: 'Use business for commercial pricing; use reqs only to define undecided behavior, not for an estimate with explicit assumptions. Không dùng để định giá bán; không tự chốt nghiệp vụ.',
    relatedSkills: ['reqs', 'task', 'review', 'release'],
    starter: 'primary',
  },
  qa: {
    useWhen: [
      'Design functional tests, report real evidence, automate E2E or diagnose suite flake',
      'Viết test case, kiểm tra UAT, regression, xác minh acceptance criteria',
      "Còn thiếu case nào, kiểm tra độ phủ AC; viet test case",
    ],
    avoidWhen:
      'Use bug for a defect report; use review for document critique. Do not claim unrun tests passed. Không dùng để phản biện tài liệu hay khẳng định test chưa chạy đã pass.',
    relatedSkills: ['reqs', 'bug', 'release', 'task'],
    starter: 'primary',
  },
  comms: {
    useWhen: [
      'Draft a concise client reply, ticket comment or stakeholder update',
      'Trả lời khách hàng, viết comment, phản hồi song ngữ',
      "Soạn cmt trả lời KH, viết mail; soan cmt tra loi KH",
    ],
    avoidWhen: 'Use docs for standalone documents and track for ticket metadata changes. Không dùng để đổi metadata ticket hoặc viết tài liệu dài.',
    relatedSkills: ['track', 'business', 'docs'],
    starter: 'primary',
  },
  review: {
    useWhen: [
      'Challenge assumptions, requirements, decisions or plans',
      'Review tài liệu, tìm mâu thuẫn, phản biện proposal',
      "Proposal này có gì chưa ổn, rà giả định; ra soat proposal",
    ],
    avoidWhen: 'Source-code changes, PRs and diffs belong to code-review; test execution belongs to qa or dev.',
    relatedSkills: ['reqs', 'business', 'research', 'plan', 'qa'],
    starter: 'primary',
  },
  release: {
    useWhen: [
      'Assess go-live readiness, release notes, rollout or rollback',
      'Checklist release, kiểm tra go-live, kế hoạch rollback',
      "Check readiness theo release gate, rollback; kiem tra go live",
    ],
    avoidWhen:
      'Infrastructure troubleshooting alone is not release management; readiness does not authorize deployment. Không dùng để sửa lỗi build đơn thuần; đánh giá không cấp quyền deploy.',
    relatedSkills: ['qa', 'track', 'plan', 'comms'],
    starter: 'primary',
  },
}
