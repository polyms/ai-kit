import type { SkillPackName } from './skill-pack'

/** Routing hints are advisory. Clients interpret user intent; no server-side model or keyword gate. */
export type SkillRoutingHint = {
  useWhen: readonly string[]
  avoidWhen: string
  relatedSkills: readonly SkillPackName[]
  starter: 'entry' | 'primary'
}

export const SKILL_ROUTING: Record<SkillPackName, SkillRoutingHint> = {
  reqs: {
    useWhen: [
      "Define business rules, BRD, PRD or acceptance criteria",
      "Làm rõ yêu cầu, viết đặc tả nghiệp vụ"
    ],
    avoidWhen: "A known defect or standalone implementation ticket; do not rewrite approved requirements.",
    relatedSkills: [
      "research",
      "review",
      "plan",
      "task",
      "qa"
    ],
    starter: 'entry'
  },
  design: {
    useWhen: [
      "Specify UI flows, screens, states or audit a design",
      "Thiết kế giao diện, rà soát UI"
    ],
    avoidWhen: "Writing product requirements, implementing code or generating a new visual asset.",
    relatedSkills: [
      "reqs",
      "review",
      "qa"
    ],
    starter: 'entry'
  },
  research: {
    useWhen: [
      "Investigate current evidence, compare technologies or competitors",
      "Nghiên cứu, so sánh giải pháp, kiểm chứng nguồn"
    ],
    avoidWhen: "A short factual answer needs no structured research; business decisions belong to business.",
    relatedSkills: [
      "business",
      "reqs",
      "review"
    ],
    starter: 'primary'
  },
  business: {
    useWhen: [
      "Evaluate pricing, economics, feasibility or strategic options",
      "Tính giá, biên lợi nhuận, phân tích phương án"
    ],
    avoidWhen: "Specify confirmed product behavior with reqs; use research for evidence gathering alone.",
    relatedSkills: [
      "research",
      "review",
      "reqs",
      "plan"
    ],
    starter: 'primary'
  },
  docs: {
    useWhen: [
      "Draft standalone documentation, SOP, meeting notes or handover",
      "Viết tài liệu, biên bản, bàn giao"
    ],
    avoidWhen: "Use comms for short replies and reqs for requirements.",
    relatedSkills: [
      "research",
      "reqs",
      "review",
      "comms"
    ],
    starter: 'entry'
  },
  task: {
    useWhen: [
      "Draft or create new work items with verifiable outcomes",
      "Viết task, chia công việc, tạo ticket mới"
    ],
    avoidWhen: "Use bug for defects and track for updates to existing issues.",
    relatedSkills: [
      "reqs",
      "plan",
      "qa",
      "track"
    ],
    starter: 'primary'
  },
  bug: {
    useWhen: [
      "Report an observed defect with expected and actual behavior",
      "Log bug, báo lỗi, ghi nhận regression"
    ],
    avoidWhen: "Use task for enhancements; never invent a defect or reproduction.",
    relatedSkills: [
      "qa",
      "track",
      "task"
    ],
    starter: 'primary'
  },
  track: {
    useWhen: [
      "Inspect, summarize or update existing tickets and their fields",
      "Check ticket, assign hàng loạt, cập nhật deadline, thống kê backlog"
    ],
    avoidWhen: "Use task or bug to create new work; use comms to draft a reply.",
    relatedSkills: [
      "task",
      "bug",
      "comms",
      "plan"
    ],
    starter: 'primary'
  },
  plan: {
    useWhen: [
      "Estimate effort, capacity, dependencies and milestones",
      "Estimate man-days, chia phase, lập tiến độ"
    ],
    avoidWhen: "Use business for commercial pricing; use reqs when the scope itself is undecided.",
    relatedSkills: [
      "reqs",
      "task",
      "review",
      "release"
    ],
    starter: 'primary'
  },
  qa: {
    useWhen: [
      "Derive functional tests, review coverage or report real QA evidence",
      "Viết test case, kiểm tra UAT, regression, xác minh acceptance criteria"
    ],
    avoidWhen: "Use bug for a defect report; use review for document critique. Do not claim unrun tests passed.",
    relatedSkills: [
      "reqs",
      "bug",
      "release",
      "task"
    ],
    starter: 'primary'
  },
  comms: {
    useWhen: [
      "Draft a concise client reply, ticket comment or stakeholder update",
      "Trả lời khách hàng, viết comment, phản hồi song ngữ"
    ],
    avoidWhen: "Use docs for standalone documents and track for ticket metadata changes.",
    relatedSkills: [
      "track",
      "business",
      "docs"
    ],
    starter: 'primary'
  },
  review: {
    useWhen: [
      "Challenge assumptions, requirements, decisions or plans",
      "Review tài liệu, tìm mâu thuẫn, phản biện proposal"
    ],
    avoidWhen: "Source-code review is a separate engineering workflow; execution of tests belongs to qa.",
    relatedSkills: [
      "reqs",
      "business",
      "research",
      "plan",
      "qa"
    ],
    starter: 'primary'
  },
  release: {
    useWhen: [
      "Assess go-live readiness, release notes, rollout or rollback",
      "Checklist release, kiểm tra go-live, kế hoạch rollback"
    ],
    avoidWhen: "Infrastructure troubleshooting alone is not release management; readiness does not authorize deployment.",
    relatedSkills: [
      "qa",
      "track",
      "plan",
      "comms"
    ],
    starter: 'primary'
  }
}
