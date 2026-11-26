import type { Locale } from '../paraglide/runtime'
import { workSkillOverlays } from './work-skills'

/** Plain string when EN/VI copy is identical (identifiers, arrow chains); otherwise per-locale prose. */
export type LocalizedString = string | Record<Locale, string>

export type SkillInvocation = 'user' | 'model'
export type SkillDomain =
  | 'repo-config'
  | 'alignment'
  | 'requirements'
  | 'triage'
  | 'design'
  | 'implementation'
  | 'review'
  | 'authoring'
  | 'architecture'
  | 'devops'
  | 'docs'
  | 'e2e'
  | 'work'

export type AgentPanel = {
  role: LocalizedString
  owns: string | string[]
  invokeHint: LocalizedString
}

export type SkillPipeline =
  | LocalizedString
  | {
      upstream?: LocalizedString | LocalizedString[]
      downstream?: LocalizedString | LocalizedString[]
    }

export type SkillOverlay = {
  name: string
  invoke: string
  slug: string
  description: LocalizedString
  invocation: SkillInvocation
  domain: SkillDomain
  githubPath: string
  summary?: LocalizedString
  whenToUse?: LocalizedString
  pipeline?: SkillPipeline
  boundaries?: LocalizedString
  /** What must be true before invoking — bullets. */
  prerequisites?: LocalizedString[]
  /** Numbered end-user steps (3–7). */
  howTo?: LocalizedString[]
  /** Observable outcome when the skill run is complete. */
  doneWhen?: LocalizedString
  /** Common mistakes / pairwise tips — prefer main-path skills. */
  tips?: LocalizedString[]
  agentPanel?: AgentPanel
  samplePrompt?: LocalizedString
  footnote?: LocalizedString
  relatedAgents?: string[]
}

/** Map principal agent id → primary skill slug on the kit site (not GitHub blob). */
export const AGENT_SKILL_SLUG: Record<string, string> = {
  pm: 'reqs',
  designer: 'design',
  developer: 'dev',
  tester: 'qa',
  techlead: 'docs',
}

export const GITHUB_REPO = 'https://github.com/polyms/ai-kit'

export const skillOverlays: SkillOverlay[] = [
  {
    name: 'setup',
    invoke: '/setup',
    slug: 'setup',
    description: {
      en: 'Configure canonical project data, execution routes, issue tracker, domain docs and agent pointers.',
      vi: 'Cấu hình nguồn dữ liệu chính thức, đường thực thi, issue tracker, tài liệu domain và agent.',
    },
    invocation: 'user',
    domain: 'repo-config',
    samplePrompt: '/setup',
    githubPath: 'skills/setup/',
    summary: {
      en: 'One-time setup for a project: where issues live, how docs are laid out, and which agent files the pipeline should use.',
      vi: 'Cấu hình một lần cho dự án: issue nằm đâu, docs bố cục thế nào, và pipeline nên dùng file agent nào.',
    },
    whenToUse: {
      en: 'New repo, or the first time you wire ai-kit into a project. Run this before `/reqs`, `/task`, or `/track`.',
      vi: 'Repo mới, hoặc lần đầu gắn ai-kit vào dự án. Chạy trước `/reqs`, `/task`, hoặc `/track`.',
    },
    pipeline: {
      upstream: {
        en: 'Install (`npx skills add`) — skills into your editor',
        vi: 'Cài đặt (`npx skills add`) — đưa skill vào editor',
      },
      downstream: {
        en: '/align, /reqs, /track, and the rest of the pipeline',
        vi: '/align, /reqs, /track, và các bước còn lại của pipeline',
      },
    },
    boundaries: {
      en: 'Does not install skills — that is `npx skills add`. Does not handle day-to-day repo maintenance.',
      vi: 'Không cài skill — việc đó là `npx skills add`. Cũng không phải bảo trì repo hàng ngày.',
    },
    prerequisites: [
      {
        en: 'Skills installed with `npx skills add` for your client: Cursor, Claude Code, Codex, or Copilot.',
        vi: 'Đã cài skill bằng `npx skills add` cho client đang dùng: Cursor, Claude Code, Codex hoặc Copilot.',
      },
      {
        en: 'You are in the target project repo (not only the ai-kit repo).',
        vi: 'Bạn đang ở repo dự án đích (không chỉ repo ai-kit).',
      },
    ],
    howTo: [
      {
        en: 'In your target project, select `/setup` in Cursor, Claude Code, or Copilot. In Codex CLI/IDE, select `$setup` or use `/skills`; desktop clients can use their skill picker.',
        vi: 'Trong dự án đích, chọn `/setup` trên Cursor, Claude Code hoặc Copilot. Với Codex CLI/IDE, chọn `$setup` hoặc dùng `/skills`; trên desktop, dùng bộ chọn skill.',
      },
      {
        en: 'Answer where issues live, docs language, and domain layout — one decision at a time.',
        vi: 'Trả lời issue nằm đâu, ngôn ngữ docs, và bố cục domain — từng quyết định một.',
      },
      {
        en: 'Confirm the agent writes `docs/agents/` pointers and related config for this repo.',
        vi: 'Xác nhận agent ghi pointer trong `docs/agents/` và cấu hình liên quan cho repo này.',
      },
      {
        en: 'Restart or refresh the chat, then run `/align` or `/track` as needed.',
        vi: 'Restart hoặc làm mới chat, rồi chạy `/align` hoặc `/track` khi cần.',
      },
    ],
    doneWhen: {
      en: 'The repo has setup artifacts so `/reqs`, `/task`, and `/track` can find the tracker and docs layout.',
      vi: 'Repo đã có artifact setup để `/reqs`, `/task`, và `/track` tìm được tracker và bố cục docs.',
    },
    tips: [
      {
        en: 'Bootstrap symlinks skills; `/setup` configures the project — do both, in that order.',
        vi: 'Bootstrap symlink skill; `/setup` cấu hình dự án — làm cả hai, theo thứ tự đó.',
      },
      {
        en: 'Run `/setup` once per repo, not before every feature.',
        vi: 'Chạy `/setup` một lần mỗi repo, không phải trước mọi feature.',
      },
    ],
  },
  {
    name: 'align',
    invoke: '/align',
    slug: 'align',
    description: {
      en: 'Agree on the plan before you build — grill decisions one question at a time, sharpen domain words, update CONTEXT.md as you go.',
      vi: 'Thống nhất kế hoạch trước khi code — hỏi xoáy từng câu một, chốt từ domain, cập nhật CONTEXT.md ngay trong lúc làm.',
    },
    invocation: 'model',
    domain: 'alignment',
    samplePrompt: {
      en: '/align\n\nGrill the plan for [feature].',
      vi: '/align\n\nGrill kế hoạch [feature].',
    },
    footnote: {
      en: 'Uses decision-loop and domain-modeling references; interactive grilling stays in the conversation, while delegated work returns blockers.',
      vi: 'Dùng workflow làm rõ quyết định và mô hình domain; phiên tự động trả về câu hỏi còn vướng.',
    },
    githubPath: 'skills/align/',
    summary: {
      en: "Resolve decision branches and model domain vocabulary and ADRs, using one question at a time when needed.",
      vi: "Làm rõ nhánh quyết định, thuật ngữ domain và ADR; hỏi từng câu khi cần.",
    },
    whenToUse: {
      en: 'Before `/reqs`, `/design`, or `/dev` when scope, terms, or trade-offs are still fuzzy.',
      vi: 'Trước `/reqs`, `/design`, hoặc `/dev` khi phạm vi, thuật ngữ, hoặc đánh đổi còn mơ hồ.',
    },
    pipeline: {
      upstream: { en: 'Idea or rough plan', vi: 'Ý tưởng hoặc kế hoạch sơ bộ' },
      downstream: {
        en: '/reqs → /design → /dev',
        vi: '/reqs → /design → /dev',
      },
    },
    boundaries: {
      en: 'Does not write a PRD; use the discovery or lean branch of `/reqs`. Does not implement code.',
      vi: 'Không viết PRD; dùng nhánh khám phá hoặc lean của `/reqs`. Không implement code.',
    },
    prerequisites: [
      {
        en: 'Skills installed; `/setup` done if you will publish later.',
        vi: 'Đã cài skill; đã `/setup` nếu sắp publish.',
      },
      {
        en: 'A fuzzy idea, plan, or feature name — exact scope can wait.',
        vi: 'Có ý tưởng, kế hoạch, hoặc tên feature còn mơ hồ — phạm vi chính xác có thể chờ.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/align` and name the feature or plan to grill.',
        vi: 'Gọi `/align` và nêu feature hoặc kế hoạch cần hỏi xoáy.',
      },
      {
        en: 'Answer one question at a time — pick A/B/C/D when offered (recommended option marked).',
        vi: 'Trả lời từng câu một — chọn A/B/C/D khi có (option đề xuất đã đánh dấu).',
      },
      {
        en: 'Let the agent update `CONTEXT.md` with shared vocabulary as you go.',
        vi: 'Để agent cập nhật `CONTEXT.md` với từ vựng chung trong lúc làm.',
      },
      {
        en: 'When decisions are clear, follow the `## Next Step` cue (`/reqs`, `/design`, or `/dev`).',
        vi: 'Khi quyết định đã rõ, làm theo gợi ý `## Next Step` (`/reqs`, `/design`, hoặc `/dev`).',
      },
    ],
    doneWhen: {
      en: 'Major forks are settled, domain words live in `CONTEXT.md`, and the next pipeline skill is named.',
      vi: 'Các nhánh quyết định lớn đã chốt, từ domain nằm trong `CONTEXT.md`, và skill pipeline tiếp theo đã được nêu.',
    },
    tips: [
      {
        en: 'Still need discovery or a long PRD? Next is `/reqs`. Aligned and ready to publish lean? Use `/reqs`.',
        vi: 'Còn cần khám phá hoặc PRD dài? Tiếp là `/reqs`. Đã align và muốn publish bản gọn? Dùng `/reqs`.',
      },
      {
        en: 'The grill stays in this chat — there is no `align` subagent.',
        vi: 'Hỏi xoáy diễn ra trong chat này — không có subagent `align`.',
      },
    ],
  },
  {
    name: 'reqs',
    invoke: '/reqs',
    slug: 'reqs',
    description: {
      en: 'Requirements work — discovery, enterprise PRD, user stories, acceptance criteria, scope, and prioritization. Publishes only through the explicitly authorized lean PRD branch.',
      vi: 'Làm yêu cầu sản phẩm — khám phá, PRD đầy đủ, user story, tiêu chí chấp nhận, phạm vi, và ưu tiên. Không xuất bản lên tracker.',
    },
    invocation: 'user',
    domain: 'requirements',
    samplePrompt: '/reqs\n\n[feature]\nUsers: [who]\nSuccess metric: [what]\nDeadline: [when]',
    githubPath: 'skills/reqs/',
    relatedAgents: ['pm'],
    agentPanel: {
      role: 'PRINCIPAL PM',
      owns: ['PRD', 'user stories', 'acceptance criteria', 'scope'],
      invokeHint: {
        en: 'Use the pm to write a PRD for [feature]',
        vi: 'Nhờ agent pm viết PRD cho [tính năng]',
      },
    },
    summary: {
      en: "Discover requirements, write enterprise or lean PRDs, and publish aligned specifications only when authorized.",
      vi: "Làm rõ yêu cầu, viết PRD enterprise hoặc lean, và xuất bản đặc tả đã thống nhất khi được phép.",
    },
    whenToUse: {
      en: 'When you still need discovery, a formal PRD, prioritization, or stakeholder-ready requirements — not the post-align publish path.',
      vi: 'Khi còn cần khám phá, PRD formal, sắp xếp ưu tiên, hoặc req sẵn sàng trình stakeholder — không phải đường xuất bản sau `/align`.',
    },
    pipeline: {
      upstream: { en: '/align (recommended)', vi: '/align (nên chạy trước)' },
      downstream: {
        en: '/reqs (to publish), /task, /design, /dev',
        vi: '/reqs (để xuất bản), /task, /design, /dev',
      },
    },
    boundaries: {
      en: 'Lean PRD publication requires the explicit publish intent and approval gates. Does not design UI layout — that is `/design`.',
      vi: 'Không xuất bản PRD gọn từ chat — việc đó của `/reqs`. Không thiết kế layout UI — đó là `/design`.',
    },
    prerequisites: [
      {
        en: 'Problem and users are roughly known (or you want discovery first).',
        vi: 'Đã nắm sơ problem và user (hoặc muốn discovery trước).',
      },
      {
        en: '`/align` recommended when trade-offs or terms are still fuzzy.',
        vi: 'Nên `/align` trước khi đánh đổi hoặc thuật ngữ còn mơ hồ.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/reqs` with the feature, users, success metric, and any deadline.',
        vi: 'Gọi `/reqs` kèm feature, user, success metric, và deadline nếu có.',
      },
      {
        en: 'Confirm the problem statement and scope boundary when asked.',
        vi: 'Xác nhận problem statement và ranh giới phạm vi khi được hỏi.',
      },
      {
        en: 'Review the enterprise PRD / stories in chat — fill or mark `[NEEDS CLARIFICATION]`.',
        vi: 'Rà PRD đầy đủ / story trong chat — điền hoặc đánh `[NEEDS CLARIFICATION]`.',
      },
      {
        en: 'When ready, request the lean PRD publication branch of `/reqs`; do not repeat discovery.',
        vi: 'Khi sẵn sàng, yêu cầu nhánh publish PRD gọn của `/reqs`; không hỏi lại phần đã thống nhất.',
      },
    ],
    doneWhen: {
      en: 'You have a testable PRD or story set in chat with explicit in/out of scope — still unpublished until `/reqs`.',
      vi: 'Đã có PRD hoặc bộ story có AC trong chat, in/out of scope rõ — chưa publish cho tới `/reqs`.',
    },
    tips: [
      {
        en: '`/reqs` drafts by default. Explicit publication uses the lean workflow and mapped tracker policy.',
        vi: '`/reqs` mặc định soạn nháp; chỉ xuất bản bằng nhánh lean PRD khi được phép.',
      },
      {
        en: 'For deep PM work, ask to use the `pm` agent.',
        vi: 'Cho công việc PM sâu, nhờ dùng agent `pm`.',
      },
    ],
  },
  {
    name: 'design',
    invoke: '/design',
    slug: 'design',
    description: {
      en: 'Turn a PRD or feature brief into an engineering-ready UI spec mapped to @polyms/ui-kit.',
      vi: 'Biến PRD hoặc tóm tắt tính năng thành đặc tả UI sẵn sàng cho kỹ thuật, map theo @polyms/ui-kit.',
    },
    invocation: 'user',
    domain: 'design',
    samplePrompt: '/design\n\nPRD #42',
    githubPath: 'skills/design/',
    relatedAgents: ['designer'],
    agentPanel: {
      role: 'PRINCIPAL DESIGNER',
      owns: ['docs/design/', '@polyms/ui-kit component maps'],
      invokeHint: {
        en: 'Use the designer to spec UI from PRD #42',
        vi: 'Nhờ agent designer viết đặc tả giao diện từ PRD #42',
      },
    },
    summary: {
      en: 'Write UI specs at `docs/design/<feature>.md` — flows, empty/loading/error/success states, accessibility, and ui-kit component maps.',
      vi: 'Viết đặc tả UI tại `docs/design/<feature>.md` — luồng, bốn trạng thái empty/loading/error/success, a11y, và map component ui-kit.',
    },
    whenToUse: {
      en: 'A PRD exists and screens or flows need a spec before `/dev` ships UI.',
      vi: 'Đã có PRD và màn hình hoặc luồng cần đặc tả trước khi `/dev` ship UI.',
    },
    pipeline: {
      upstream: {
        en: '/align → /reqs',
        vi: '/align → /reqs',
      },
      downstream: '/dev',
    },
    boundaries: {
      en: 'Does not rewrite product scope (`/reqs`). Does not place code seams (`arch`). Does not document the ui-kit API (`/ui-kit` in the lib repo).',
      vi: 'Không viết lại phạm vi sản phẩm (`/reqs`). Không đặt seam trong code (`arch`). Không viết tài liệu API ui-kit (`/ui-kit` ở lib repo).',
    },
    prerequisites: [
      {
        en: 'A PRD or feature brief (tracker issue or chat draft).',
        vi: 'Có PRD hoặc tóm tắt feature (issue tracker hoặc bản nháp trong chat).',
      },
      {
        en: 'UI work is in scope for this slice.',
        vi: 'Công việc UI nằm trong phạm vi lát cắt này.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/design` and point at the PRD (e.g. PRD #42).',
        vi: 'Gọi `/design` và chỉ PRD (ví dụ PRD #42).',
      },
      {
        en: 'Walk screens and flows — confirm empty, loading, error, and success states.',
        vi: 'Đi qua màn hình và luồng — chốt trạng thái empty, loading, error, success.',
      },
      {
        en: 'Confirm the spec lands at `docs/design/<feature>.md` with `@polyms/ui-kit` maps.',
        vi: 'Xác nhận đặc tả nằm tại `docs/design/<feature>.md` kèm map `@polyms/ui-kit`.',
      },
      {
        en: 'Hand off to `/dev` with the design path.',
        vi: 'Giao cho `/dev` kèm đường dẫn design.',
      },
    ],
    doneWhen: {
      en: 'An engineering-ready UI spec exists under `docs/design/` covering flows, four states, a11y, and component maps.',
      vi: 'Đã có đặc tả UI sẵn sàng kỹ thuật dưới `docs/design/` gồm luồng, bốn trạng thái, a11y, và map component.',
    },
    tips: [
      {
        en: 'Long sessions: ask to use the `designer` agent.',
        vi: 'Session dài: nhờ dùng agent `designer`.',
      },
      {
        en: 'Product scope changes belong in `/reqs`, not in the design pass.',
        vi: 'Đổi phạm vi sản phẩm thuộc `/reqs`, không nằm trong vòng design.',
      },
    ],
  },
  {
    name: 'dev',
    invoke: '/dev',
    slug: 'dev',
    description: {
      en: 'Ship production code from a spec — TDD at confirmed seams, solution ladder, scope check, and debugging.',
      vi: 'Ship code production từ đặc tả — TDD tại seam đã chốt, thang giải pháp, tự kiểm phạm vi, và gỡ lỗi.',
    },
    invocation: 'model',
    domain: 'implementation',
    samplePrompt: '/dev\n\n[feature] — docs/prd/feature-x.md',
    githubPath: 'skills/dev/',
    relatedAgents: ['developer'],
    agentPanel: {
      role: 'PRINCIPAL ENGINEER',
      owns: ['production code', 'TDD', 'solution ladder', 'scope self-check', 'status report', 'debugging'],
      invokeHint: {
        en: 'Use the developer to implement [feature] from spec',
        vi: 'Nhờ agent developer triển khai [tính năng] từ đặc tả',
      },
    },
    summary: {
      en: "Prepare feature specifications when missing, implement approved behavior and debug with verified tests.",
      vi: "Chuẩn bị đặc tả còn thiếu, triển khai hành vi đã duyệt và sửa lỗi bằng kiểm thử có bằng chứng.",
    },
    whenToUse: {
      en: 'The spec is ready (`ready-for-agent` issue, PRD, or `docs/design/`). Pick up one vertical slice at a time.',
      vi: 'Đặc tả đã sẵn (`ready-for-agent`, PRD, hoặc `docs/design/`). Nhận từng lát cắt dọc một.',
    },
    pipeline: {
      upstream: {
        en: '/design or agent brief from `/track`',
        vi: '/design hoặc agent brief từ `/track`',
      },
      downstream: '/review',
    },
    boundaries: {
      en: 'Does not write requirements or UI specs. Pre-merge review is `/review`, not part of the `/dev` loop.',
      vi: 'Không viết yêu cầu hay đặc tả UI. Rà soát trước merge là `/review`, không nằm trong vòng `/dev`.',
    },
    prerequisites: [
      {
        en: 'A ready spec: PRD, `docs/design/`, or `ready-for-agent` brief.',
        vi: 'Đặc tả sẵn: PRD, `docs/design/`, hoặc tóm tắt `ready-for-agent`.',
      },
      {
        en: 'One vertical slice — not the whole epic at once.',
        vi: 'Một lát cắt dọc — không ôm cả epic một lần.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/dev` (or ask to use the `developer` agent) with the spec path or issue.',
        vi: 'Gọi `/dev` (hoặc nhờ agent `developer`) kèm đường dẫn spec hoặc issue.',
      },
      {
        en: 'Confirm seams and climb the solution ladder before writing production code.',
        vi: 'Chốt seam và leo thang giải pháp trước khi viết code production.',
      },
      {
        en: 'Expect TDD at the seams you confirmed — tests first where the skill requires it.',
        vi: 'Kỳ vọng TDD tại seam đã chốt — test trước khi skill yêu cầu.',
      },
      {
        en: 'When the slice is green, run `/review` before merge.',
        vi: 'Khi lát cắt đã xanh, chạy `/review` trước khi merge.',
      },
    ],
    doneWhen: {
      en: 'The vertical slice is implemented with tests at confirmed seams and ready for `/review`.',
      vi: 'Lát cắt đã implement kèm test tại seam đã chốt và sẵn sàng cho `/review`.',
    },
    tips: [
      {
        en: 'Do not invent requirements mid-flight — escalate to `/reqs` or `/align`.',
        vi: 'Không bịa yêu cầu giữa chừng — escalate lên `/reqs` hoặc `/align`.',
      },
      {
        en: 'Deploy/CI breakage is `/devops`, not a feature `/dev` pass.',
        vi: 'Deploy/CI gãy là `/devops`, không phải vòng `/dev` feature.',
      },
    ],
  },
  {
    name: 'docs',
    invoke: '/docs',
    slug: 'docs',
    description: {
      en: 'Write developer docs — API reference, tutorials, integration guides, and migration notes.',
      vi: 'Viết tài liệu cho developer — tham chiếu API, hướng dẫn, tích hợp, và ghi chú migration.',
    },
    invocation: 'user',
    domain: 'docs',
    samplePrompt: {
      en: '/docs\n\nTutorial: wire Cursor to the kit MCP and search Knowledge (intent: incident)',
      vi: '/docs\n\nHướng dẫn: gắn Cursor với kit MCP và tìm Knowledge (intent: incident)',
    },
    githubPath: 'skills/docs/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['API reference', 'tutorials', 'integration guides', 'migration notes'],
      invokeHint: { en: 'Use the techlead to [task]', vi: 'Nhờ agent techlead làm [công việc]' },
    },
    summary: {
      en: 'Document shipped surfaces so a new integrator can follow them without Slack. Verify examples against real code — not PRDs, not feature work.',
      vi: 'Tài liệu hóa bề mặt đã ship để người tích hợp mới làm theo được mà không cần hỏi Slack. Kiểm ví dụ khớp code thật — không phải PRD, không phải làm feature.',
    },
    whenToUse: {
      en: 'After a public API, MCP, or CLI ships, or when docs have drifted from the code.',
      vi: 'Sau khi API công khai, MCP, hoặc CLI đã ship, hoặc khi docs lệch so với code.',
    },
    pipeline: {
      upstream: {
        en: '/dev (shipped seam) or an existing schema/MCP',
        vi: '/dev (seam đã ship) hoặc schema/MCP sẵn có',
      },
      downstream: {
        en: 'Published docs path / optional `/qa` how-to',
        vi: 'Đường docs đã publish / tùy chọn hướng dẫn cho `/qa`',
      },
    },
    boundaries: {
      en: 'Does not write product requirements (`/reqs`). Does not implement features (`/dev`). Does not write marketing copy.',
      vi: 'Không viết yêu cầu sản phẩm (`/reqs`). Không implement feature (`/dev`). Không viết nội dung marketing.',
    },
    prerequisites: [
      {
        en: 'A shipped public surface (API, MCP, CLI) or docs that drifted from code.',
        vi: 'Bề mặt công khai đã ship (API, MCP, CLI) hoặc docs lệch so với code.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/docs` with the audience and doc type (tutorial, API reference, migration).',
        vi: 'Gọi `/docs` kèm audience và loại tài liệu (hướng dẫn, tham chiếu API, migration).',
      },
      {
        en: 'Point at the real code or MCP paths the examples must match.',
        vi: 'Chỉ đường dẫn code hoặc MCP mà ví dụ phải khớp.',
      },
      {
        en: 'Review the draft against a fresh integrator path — no Slack required.',
        vi: 'Rà bản nháp theo đường người tích hợp mới — không cần hỏi Slack.',
      },
      {
        en: 'Publish to the agreed docs path; optionally add an `/qa` how-to if journeys matter.',
        vi: 'Publish vào đường docs đã chốt; tùy chọn thêm hướng dẫn `/qa` nếu hành trình quan trọng.',
      },
    ],
    doneWhen: {
      en: 'Verified developer docs exist for the surface and examples match real code.',
      vi: 'Đã có docs developer đã kiểm chứng cho bề mặt đó và ví dụ khớp code thật.',
    },
  },
  {
    name: 'craft',
    invoke: '/craft',
    slug: 'craft',
    description: {
      en: 'Guide for writing and editing ai-kit skills — keep them predictable, prune sprawl, get invocation right.',
      vi: 'Hướng dẫn viết và sửa skill ai-kit — giữ dự đoán được, cắt lan man, gọi lệnh đúng kiểu.',
    },
    invocation: 'user',
    domain: 'authoring',
    samplePrompt: '/craft\n\nskills/reqs/SKILL.md',
    githubPath: 'skills/craft/',
    summary: {
      en: 'Author or refactor skills under `skills/` and `agents/` so the same process runs every time — not the same output.',
      vi: 'Viết hoặc refactor skill trong `skills/` và `agents/` để cùng một quy trình chạy mỗi lần — không phải cùng một output.',
    },
    whenToUse: {
      en: 'Creating or refactoring skills under `skills/` or `agents/`.',
      vi: 'Khi tạo mới hoặc refactor skill trong `skills/` hoặc `agents/`.',
    },
    pipeline: {
      upstream: { en: 'Skill or agent file to improve', vi: 'File skill hoặc agent cần cải thiện' },
      downstream: { en: 'Committed skill changes', vi: 'Thay đổi skill đã commit' },
    },
    boundaries: {
      en: 'Not for shipping product features in app repos — meta-authoring for ai-kit only.',
      vi: 'Không dùng để ship feature sản phẩm trong app repo — chỉ biên soạn meta cho ai-kit.',
    },
    prerequisites: [
      {
        en: 'Working tree is the ai-kit repo (or a fork) with a skill/agent path to improve.',
        vi: 'Working tree là repo ai-kit (hoặc fork) có đường dẫn skill/agent cần cải thiện.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/craft` and name the skill or agent file (e.g. `skills/reqs/SKILL.md`).',
        vi: 'Gọi `/craft` và nêu file skill hoặc agent (ví dụ `skills/reqs/SKILL.md`).',
      },
      {
        en: 'Ask for sprawl, no-ops, or invocation review as needed.',
        vi: 'Yêu cầu rà sprawl, no-op, hoặc cách gọi lệnh nếu cần.',
      },
      {
        en: 'Apply the suggested edits; keep the process predictable, not the output identical.',
        vi: 'Áp sửa đề xuất; giữ quy trình dự đoán được, không bắt output giống hệt.',
      },
      {
        en: 'Commit skill changes when ready.',
        vi: 'Commit thay đổi skill khi sẵn sàng.',
      },
    ],
    doneWhen: {
      en: 'The skill or agent file is tighter, invocation is correct, and no silent no-ops remain in the playbook.',
      vi: 'File skill hoặc agent gọn hơn, cách gọi đúng, và không còn no-op im lặng trong playbook.',
    },
  },
  {
    name: 'arch',
    invoke: '/arch',
    slug: 'arch',
    description: {
      en: 'Architecture vocabulary for deep modules — seam, depth, leverage, locality, design-it-twice.',
      vi: 'Từ vựng kiến trúc cho module sâu — seam, depth, leverage, locality, design-it-twice.',
    },
    invocation: 'model',
    domain: 'architecture',
    footnote: {
      en: 'Model-invoked — the agent reaches this when placing seams or deepening a module.',
      vi: 'Agent tự gọi — agent tìm tới đây khi cần đặt seam hoặc làm sâu module.',
    },
    githubPath: 'skills/arch/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['seams', 'depth', 'leverage', 'design-it-twice'],
      invokeHint: {
        en: 'Use the techlead to place seams for [module]',
        vi: 'Nhờ agent techlead đặt seam cho [module]',
      },
    },
    summary: {
      en: "Design deep modules and assess architectural refactor candidates with evidence and testable seams.",
      vi: "Thiết kế module sâu, đánh giá phương án refactor kiến trúc bằng bằng chứng và seam kiểm thử.",
    },
    whenToUse: {
      en: 'Automatically when designing module seams or deepening interfaces; invoke explicitly for architecture discussions.',
      vi: 'Tự động khi thiết kế seam hoặc làm sâu interface; gọi rõ khi cần thảo luận kiến trúc.',
    },
    pipeline: {
      upstream: { en: 'Implementation or design context', vi: 'Ngữ cảnh từ implement hoặc design' },
      downstream: {
        en: 'Better `/dev` or `/design` decisions',
        vi: 'Quyết định tốt hơn cho `/dev` hoặc `/design`',
      },
    },
    boundaries: {
      en: 'Not visual UI design; the refactor assessment branch proposes changes without implementing them.',
      vi: 'Không phải thiết kế giao diện; nhánh đánh giá refactor chỉ đề xuất, không tự triển khai.',
    },
    prerequisites: [
      {
        en: 'Usually none — the agent discovers `arch` when placing seams. Optional: open a chat about module boundaries.',
        vi: 'Thường không cần — agent tự tìm `arch` khi đặt seam. Tùy chọn: mở chat về ranh giới module.',
      },
    ],
    howTo: [
      {
        en: 'Prefer letting `/dev` or `/design` pull `arch` in when seams matter.',
        vi: 'Ưu tiên để `/dev` hoặc `/design` gọi `arch` khi cần seam.',
      },
      {
        en: 'Or ask explicitly to discuss seam, depth, leverage, locality, or design-it-twice.',
        vi: 'Hoặc hỏi rõ để thảo luận seam, depth, leverage, locality, hoặc design-it-twice.',
      },
      {
        en: 'Apply the vocabulary to the module you are changing — do not invent a parallel glossary.',
        vi: 'Áp từ vựng vào module đang đổi — không bịa glossary song song.',
      },
      {
        en: 'For a maintenance scan of deepening debt, use `/arch` instead.',
        vi: 'Để quét bảo trì nợ làm sâu, dùng `/arch` thay thế.',
      },
    ],
    doneWhen: {
      en: 'Seam and depth decisions use shared `arch` terms and inform the current `/dev` or `/design` work.',
      vi: 'Quyết định seam và depth dùng từ `arch` chung và phục vụ việc `/dev` hoặc `/design` hiện tại.',
    },
  },
  {
    name: 'devops',
    invoke: '/devops',
    slug: 'devops',
    description: {
      en: 'Deploy, CI, and infra — go from symptom to fix via Knowledge (`intent: incident`), with SEV and post-mortem templates.',
      vi: 'Deploy, CI, và hạ tầng — đi từ triệu chứng tới cách xử lý qua Knowledge (`intent: incident`), kèm mẫu SEV và post-mortem.',
    },
    invocation: 'model',
    domain: 'devops',
    samplePrompt: {
      en: '/devops\n\nVercel deploy failed on TanStack Start monorepo',
      vi: '/devops\n\nVercel deploy fail trên monorepo TanStack Start',
    },
    githubPath: 'skills/devops/',
    relatedAgents: ['developer', 'techlead'],
    agentPanel: {
      role: 'PRINCIPAL ENGINEER · TECH LEAD',
      owns: ['incident knowledge', 'stack profiles', 'deploy/CI fixes', 'SEV/post-mortem'],
      invokeHint: {
        en: 'Use the developer to [symptom] — or techlead for SEV ownership',
        vi: 'Nhờ agent developer xử lý [triệu chứng] — hoặc techlead nếu cần chủ trì SEV',
      },
    },
    summary: {
      en: 'When deploy or CI breaks: search Knowledge with `intent: incident`, confirm cause, fix, verify, then close with SEV or post-mortem templates when severity warrants it.',
      vi: 'Khi deploy hoặc CI gãy: tìm Knowledge với `intent: incident`, chốt nguyên nhân, sửa, xác minh, rồi đóng bằng mẫu SEV hoặc post-mortem khi mức độ đủ nặng.',
    },
    whenToUse: {
      en: 'Vercel or build failures, monorepo deploy traps, CI infra changes — search Knowledge (`intent: incident`) before changing config.',
      vi: 'Deploy Vercel hoặc build lỗi, monorepo dính bẫy deploy, hoặc đổi hạ tầng CI — tìm Knowledge (`intent: incident`) trước khi sửa config.',
    },
    pipeline: {
      upstream: {
        en: 'App deploy docs (e.g. `apps/*/DEPLOY.md`)',
        vi: 'Tài liệu deploy của app (ví dụ `apps/*/DEPLOY.md`)',
      },
      downstream: {
        en: 'Verified green deploy/CI (+ post-mortem when SEV1/SEV2)',
        vi: 'Deploy/CI xanh đã xác minh (+ post-mortem nếu SEV1/SEV2)',
      },
    },
    boundaries: {
      en: 'Not application feature code — operational playbooks and infra config. Design seams → `arch`; feature work → `/dev`.',
      vi: 'Không phải code feature ứng dụng — đây là sổ tay vận hành và config hạ tầng. Đặt seam → `arch`; làm feature → `/dev`.',
    },
    prerequisites: [
      {
        en: 'A deploy/CI/infra symptom (logs, failing job, host error).',
        vi: 'Có triệu chứng deploy/CI/hạ tầng (log, job fail, lỗi host).',
      },
      {
        en: 'Knowledge MCP or kit site Knowledge available when searching incidents.',
        vi: 'Có Knowledge MCP hoặc Knowledge trên kit site khi tìm incident.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/devops` with the symptom (e.g. Vercel deploy failed on TanStack Start).',
        vi: 'Gọi `/devops` kèm triệu chứng (ví dụ Vercel deploy fail trên TanStack Start).',
      },
      {
        en: 'Require Knowledge search with `intent: incident` before changing config.',
        vi: 'Yêu cầu tìm Knowledge với `intent: incident` trước khi sửa config.',
      },
      {
        en: 'Confirm cause, apply the fix, and verify green deploy/CI.',
        vi: 'Chốt nguyên nhân, áp fix, và xác minh deploy/CI xanh.',
      },
      {
        en: 'For SEV1/SEV2, close with SEV or post-mortem templates (`techlead` owns SEV).',
        vi: 'Với SEV1/SEV2, đóng bằng mẫu SEV hoặc post-mortem (`techlead` chủ trì SEV).',
      },
    ],
    doneWhen: {
      en: 'Deploy/CI is verified green (or rolled back safely) and severity paperwork is done when required.',
      vi: 'Deploy/CI đã xác minh xanh (hoặc rollback an toàn) và giấy tờ mức độ nghiêm trọng đã xong khi cần.',
    },
  },
  {
    name: 'build-feature-map',
    invoke: '/build-feature-map',
    slug: 'build-feature-map',
    description: { en: 'Build and maintain a project-owned behavior index and feature-map skill.', vi: 'Tạo và duy trì bản đồ hành vi cùng skill feature map của dự án.' },
    invocation: 'user',
    domain: 'docs',
    githubPath: 'skills/build-feature-map/',
    summary: { en: 'Index feature areas using verified behavior, routes, scoped selectors and harness evidence.', vi: 'Lập chỉ mục vùng tính năng dựa trên hành vi, route, selector và bằng chứng harness đã xác minh.' },
    whenToUse: { en: 'A project needs a reusable behavior map or an existing area needs repair.', vi: 'Khi dự án cần bản đồ hành vi dùng lại hoặc cần sửa một vùng hiện có.' },
    boundaries: { en: 'Does not imply QA approval or permission to install tools; preserve the canonical map owner.', vi: 'Không tự phê duyệt QA hay cài công cụ; giữ đúng nguồn bản đồ chính thức.' },
    prerequisites: [{ en: 'Confirmed project, canonical owner, and available repository or behavior evidence.', vi: 'Dự án, nguồn sở hữu và bằng chứng repository hoặc hành vi đã xác định.' }],
    howTo: [
      { en: 'Read the target feature-map pointer and existing behavior evidence.', vi: 'Đọc pointer feature map của dự án và bằng chứng hành vi hiện có.' },
      { en: 'Seed or update only the requested areas using verified selectors and routes.', vi: 'Tạo hoặc cập nhật vùng được yêu cầu bằng selector và route đã xác minh.' },
      { en: 'Verify the index and map references, then report write status and gaps.', vi: 'Kiểm tra chỉ mục, tham chiếu bản đồ và báo trạng thái ghi cùng phần còn thiếu.' },
    ],
    doneWhen: { en: 'Map entries and index are traceable to current evidence; unsupported observations are explicit.', vi: 'Mục bản đồ và chỉ mục truy được về bằng chứng hiện tại; điểm chưa xác minh được nêu rõ.' },
    samplePrompt: { en: '/build-feature-map\n\nMap the team invitation area.', vi: '/build-feature-map\n\nLập bản đồ vùng mời thành viên.' },
  },
  ...workSkillOverlays,
]
