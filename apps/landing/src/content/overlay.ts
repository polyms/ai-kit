import type { Locale } from '../paraglide/runtime'

/** Plain string when EN/VI copy is identical (identifiers, arrow chains); otherwise per-locale prose. */
export type LocalizedString = string | Record<Locale, string>

export type SkillStatus = 'available' | 'planned'
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
  status: SkillStatus
  invocation: SkillInvocation
  domain: SkillDomain
  githubPath: string
  summary?: LocalizedString
  whenToUse?: LocalizedString
  pipeline?: SkillPipeline
  boundaries?: LocalizedString
  agentPanel?: AgentPanel
  samplePrompt?: string
  footnote?: LocalizedString
  relatedAgents?: string[]
}

export const GITHUB_REPO = 'https://github.com/polyms/ai-kit'

export const skillOverlays: SkillOverlay[] = [
  {
    name: 'setup',
    invoke: '/setup',
    slug: 'setup',
    description: {
      en: 'Configure a repo for the ai-kit pipeline — issue tracker, domain docs, agent pointers.',
      vi: 'Cấu hình repo để dùng chuỗi làm việc ai-kit — nối hệ thống theo dõi issue, tài liệu domain, và con trỏ agent.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'repo-config',
    samplePrompt: '/setup',
    githubPath: 'skills/setup/',
    summary: {
      en: 'One-time repo configuration so the ai-kit pipeline has issue tracker hooks, domain docs layout, and agent pointers.',
      vi: 'Cấu hình repo một lần để chuỗi làm việc ai-kit có sẵn móc nối hệ thống theo dõi issue, bố cục tài liệu domain, và con trỏ agent.',
    },
    whenToUse: {
      en: 'New repo or first time wiring ai-kit into a project. Run before `/to-prd`, `/to-issues`, or `/triage` (hard setup dependency).',
      vi: 'Repo mới, hoặc lần đầu gắn ai-kit vào dự án. Chạy trước `/to-prd`, `/to-issues`, hoặc `/triage` (phụ thuộc cứng vào `/setup`).',
    },
    pipeline: {
      upstream: {
        en: 'Bootstrap (`bootstrap.sh`) — symlink skills into your editor',
        vi: 'Khởi tạo (`bootstrap.sh`) — tạo liên kết tượng trưng skill vào trình soạn thảo',
      },
      downstream: {
        en: '/align, /reqs, /triage, and the rest of the pipeline',
        vi: '/align, /reqs, /triage, và các bước còn lại của chuỗi làm việc',
      },
    },
    boundaries: {
      en: 'Not bootstrap install — that is symlink setup. Not ongoing repo maintenance.',
      vi: 'Không phải cài đặt bootstrap — đó là bước tạo liên kết tượng trưng riêng. Cũng không phải việc bảo trì repo thường xuyên.',
    },
  },
  {
    name: 'align',
    invoke: '/align',
    slug: 'align',
    description: {
      en: 'Align on a plan before building — relentless grill (design tree, lettered options), sharpen domain language, update CONTEXT.md and ADRs as you go.',
      vi: 'Thống nhất kế hoạch trước khi dựng — hỏi xoáy liên tục (cây thiết kế, các lựa chọn A/B/C/D), mài sắc ngôn ngữ domain, cập nhật CONTEXT.md và ADR ngay trong lúc làm.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'alignment',
    samplePrompt: '/align\n\nGrill kế hoạch [feature] — một câu một lần, chọn A/B/C/D.',
    footnote: {
      en: 'Bundles align-loop + domain-modeling (model-invoked). Interactive grill in chat — no subagent.',
      vi: 'Kèm theo align-loop và domain-modeling (agent tự gọi). Hỏi xoáy diễn ra trực tiếp trong hội thoại — không dùng subagent.',
    },
    githubPath: 'skills/align/',
    summary: {
      en: 'Close the communication gap before `/reqs`, `/design`, or `/dev` — make implicit decisions explicit and land vocabulary in CONTEXT.md.',
      vi: 'Thu hẹp khoảng cách giao tiếp trước khi vào `/reqs`, `/design`, hoặc `/dev` — biến quyết định ngầm thành rõ ràng và chốt từ vựng vào CONTEXT.md.',
    },
    whenToUse: {
      en: 'Before `/reqs`, `/to-prd`, `/design`, or `/dev` when scope, terms, or trade-offs are still fuzzy.',
      vi: 'Trước khi vào `/reqs`, `/to-prd`, `/design`, hoặc `/dev`, khi phạm vi, thuật ngữ, hoặc đánh đổi còn mơ hồ.',
    },
    pipeline: {
      upstream: { en: 'Idea or rough plan', vi: 'Ý tưởng hoặc kế hoạch sơ bộ' },
      downstream: '/reqs hoặc /to-prd → /design → /dev',
    },
    boundaries: {
      en: 'Not a PRD draft — that is `/reqs` (enterprise) or `/to-prd` (lean publish). Not implementation.',
      vi: 'Không phải bản thảo PRD — đó là việc của `/reqs` (bản đầy đủ) hoặc `/to-prd` (bản gọn, xuất bản luôn). Cũng không phải triển khai.',
    },
  },
  {
    name: 'reqs',
    invoke: '/reqs',
    slug: 'reqs',
    description: {
      en: 'Requirements — discovery, enterprise PRD, user stories, acceptance criteria, scope, MVP, MoSCoW, RICE. Does not publish — after align use `/to-prd`.',
      vi: 'Yêu cầu sản phẩm — khám phá, PRD bản đầy đủ, user story, tiêu chí chấp nhận, phạm vi, MVP, MoSCoW, RICE. Không xuất bản — sau `/align` thì dùng `/to-prd`.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'requirements',
    samplePrompt:
      '/reqs\n\nWrite an enterprise PRD for [feature].\nUsers: [who]. Success metric: [what]. Deadline: [when].',
    githubPath: 'skills/reqs/',
    relatedAgents: ['pm'],
    agentPanel: {
      role: { en: 'PRINCIPAL PM', vi: 'PM CHÍNH' },
      owns: ['PRD', 'user stories', 'acceptance criteria', 'scope'],
      invokeHint: {
        en: 'Use the pm to write a PRD for [feature]',
        vi: 'Nhờ agent pm viết PRD cho [tính năng]',
      },
    },
    summary: {
      en: 'Turn ideas into engineering-ready specs — enterprise PRD and stories in chat. Does not publish to the tracker.',
      vi: 'Biến ý tưởng thành đặc tả sẵn sàng cho kỹ thuật — PRD bản đầy đủ và user story ngay trong hội thoại. Không xuất bản lên hệ thống theo dõi.',
    },
    whenToUse: {
      en: 'When you need discovery, enterprise PRD, prioritization, or stakeholder-ready requirements — not the post-align publish path.',
      vi: 'Khi cần khám phá, PRD bản đầy đủ, sắp xếp ưu tiên, hoặc yêu cầu sẵn sàng trình bên liên quan — không phải đường xuất bản sau khi đã `/align`.',
    },
    pipeline: {
      upstream: { en: '/align (recommended)', vi: '/align (nên chạy trước)' },
      downstream: {
        en: '/to-prd (to publish), /to-issues, /design, /dev',
        vi: '/to-prd (để xuất bản), /to-issues, /design, /dev',
      },
    },
    boundaries: {
      en: 'Not a lean publish-from-chat PRD — use `/to-prd` for that. Not UI layout — that is `/design`.',
      vi: 'Không phải PRD xuất bản nhanh từ hội thoại — việc đó của `/to-prd`. Cũng không phải bố cục giao diện — đó là `/design`.',
    },
  },
  {
    name: 'to-prd',
    invoke: '/to-prd',
    slug: 'to-prd',
    description: {
      en: 'Synthesize the current conversation into a lean PRD and publish it to the issue tracker — no interview.',
      vi: 'Chốt cuộc hội thoại hiện tại thành một PRD bản gọn và xuất bản lên hệ thống theo dõi issue — không cần phỏng vấn thêm.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'requirements',
    samplePrompt: '/to-prd\n\nChốt PRD từ cuộc chat này — publish lên GitHub.',
    githubPath: 'skills/to-prd/',
    summary: {
      en: 'When the conversation is already aligned, synthesize it into a lean PRD and publish to the issue tracker — no PM interview.',
      vi: 'Khi cuộc hội thoại đã thống nhất xong, gói lại thành một PRD bản gọn và xuất bản lên hệ thống theo dõi issue — không cần PM phỏng vấn thêm.',
    },
    whenToUse: {
      en: 'After `/align` when decisions are settled and you want a published PRD issue quickly.',
      vi: 'Sau khi `/align` xong, khi quyết định đã chốt và bạn muốn có ngay một issue PRD đã xuất bản.',
    },
    pipeline: {
      upstream: '/align',
      downstream: '/to-issues, /design',
    },
    boundaries: {
      en: 'Not discovery or scope negotiation — use `/reqs` when gaps remain. Requires `/setup` (hard dependency).',
      vi: 'Không phải khám phá hay đàm phán phạm vi — còn thiếu gì thì dùng `/reqs`. Cần chạy `/setup` trước (phụ thuộc cứng).',
    },
  },
  {
    name: 'to-issues',
    invoke: '/to-issues',
    slug: 'to-issues',
    description: {
      en: 'Break a plan, spec, or PRD into independently-grabbable GitHub issues using tracer-bullet vertical slices.',
      vi: 'Bẻ một kế hoạch, đặc tả, hoặc PRD thành các issue GitHub độc lập, nhận việc ngay được — theo lát cắt dọc kiểu tracer-bullet.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'requirements',
    samplePrompt: '/to-issues\n\nBẻ PRD #42 thành issues — vertical slices, publish lên GitHub.',
    githubPath: 'skills/to-issues/',
    summary: {
      en: 'Split an approved PRD or plan into vertical-slice GitHub issues agents can pick up independently.',
      vi: 'Chia một PRD hoặc kế hoạch đã duyệt thành các issue GitHub theo lát cắt dọc, để agent nhận việc độc lập.',
    },
    whenToUse: {
      en: 'PRD or plan is approved and you need tracker-ready work items.',
      vi: 'PRD hoặc kế hoạch đã được duyệt và bạn cần hạng mục công việc sẵn sàng đưa lên hệ thống theo dõi.',
    },
    pipeline: {
      upstream: '/reqs hoặc /to-prd',
      downstream: {
        en: '/dev (via agent briefs or direct pickup)',
        vi: '/dev (qua tóm tắt cho agent hoặc nhận việc trực tiếp)',
      },
    },
    boundaries: {
      en: 'Not triage of raw issues — that is `/triage`. Requires `/setup` (hard dependency).',
      vi: 'Không phải sàng lọc issue thô — đó là việc của `/triage`. Cần chạy `/setup` trước (phụ thuộc cứng).',
    },
  },
  {
    name: 'triage',
    invoke: '/triage',
    slug: 'triage',
    description: {
      en: 'Move GitHub issues through a triage state machine — categorise, verify, grill if needed, write agent briefs.',
      vi: 'Đưa issue GitHub đi qua máy trạng thái sàng lọc — phân loại, xác minh, hỏi xoáy thêm nếu cần, và viết tóm tắt cho agent.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'triage',
    samplePrompt:
      '/triage\n\nShow me what needs attention.\nPhân loại issue #42 — verify và viết agent brief.',
    githubPath: 'skills/triage/',
    summary: {
      en: 'Process raw GitHub issues through triage states — verify, grill when needed, attach agent briefs for `/dev`.',
      vi: 'Xử lý issue GitHub thô qua các trạng thái sàng lọc — xác minh, hỏi xoáy khi cần, gắn tóm tắt cho agent để `/dev` nhận việc.',
    },
    whenToUse: {
      en: 'Backlog has unverified issues or you need `ready-for-agent` briefs before implementation.',
      vi: 'Danh sách chờ còn issue chưa xác minh, hoặc bạn cần tóm tắt cho agent ở trạng thái `ready-for-agent` trước khi triển khai.',
    },
    pipeline: {
      upstream: { en: 'Raw GitHub issues', vi: 'Issue GitHub thô' },
      downstream: '/dev → /code-review',
    },
    boundaries: {
      en: 'Not splitting a PRD into new issues — that is `/to-issues`. Requires `/setup` (hard dependency).',
      vi: 'Không phải chia PRD thành issue mới — đó là việc của `/to-issues`. Cần chạy `/setup` trước (phụ thuộc cứng).',
    },
  },
  {
    name: 'design',
    invoke: '/design',
    slug: 'design',
    description: {
      en: 'Turn a PRD or feature brief into an engineering-ready design spec mapped to @polyms/core-ui.',
      vi: 'Biến một PRD hoặc tóm tắt tính năng thành đặc tả thiết kế sẵn sàng cho kỹ thuật, ánh xạ theo @polyms/core-ui.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'design',
    samplePrompt: '/design\n\nThiết kế màn hình từ PRD #42 — spec giao diện.',
    githubPath: 'skills/design/',
    relatedAgents: ['designer'],
    agentPanel: {
      role: { en: 'PRINCIPAL DESIGNER', vi: 'THIẾT KẾ CHÍNH' },
      owns: ['docs/design/', '@polyms/core-ui component maps'],
      invokeHint: {
        en: 'Use the designer to spec UI from PRD #42',
        vi: 'Nhờ agent designer viết đặc tả giao diện từ PRD #42',
      },
    },
    summary: {
      en: 'Produce engineering-ready UI specs at `docs/design/<feature>.md` — flows, four states, a11y, and core-ui maps.',
      vi: 'Tạo đặc tả giao diện sẵn sàng cho kỹ thuật tại `docs/design/<feature>.md` — luồng, bốn trạng thái, a11y, và ánh xạ core-ui.',
    },
    whenToUse: {
      en: 'PRD exists and UI flows or screens need a spec before `/dev` ships.',
      vi: 'Đã có PRD và luồng hoặc màn hình giao diện cần đặc tả trước khi `/dev` triển khai.',
    },
    pipeline: {
      upstream: '/align → /reqs hoặc /to-prd',
      downstream: '/dev',
    },
    boundaries: {
      en: 'Not product scope rewrite (`/reqs`). Not code seams (`arch`). Not core-ui API docs (`/core-ui` in lib repo).',
      vi: 'Không viết lại phạm vi sản phẩm (đó là `/reqs`). Không đặt seam trong code (đó là `arch`). Không viết tài liệu API core-ui (đó là `/core-ui` ở lib repo).',
    },
  },
  {
    name: 'dev',
    invoke: '/dev',
    slug: 'dev',
    description: {
      en: 'Fullstack implementation with TDD, solution ladder, scope self-check, and debugging.',
      vi: 'Triển khai toàn ngăn xếp với TDD, thang giải pháp, tự kiểm phạm vi, và gỡ lỗi.',
    },
    status: 'available',
    invocation: 'model',
    domain: 'implementation',
    samplePrompt: '/dev\n\nImplement [feature] from PRD at docs/prd/feature-x.md',
    githubPath: 'skills/dev/',
    relatedAgents: ['developer'],
    agentPanel: {
      role: { en: 'PRINCIPAL ENGINEER', vi: 'KỸ SƯ CHÍNH' },
      owns: ['production code', 'TDD', 'solution ladder', 'scope self-check', 'status report', 'debugging'],
      invokeHint: {
        en: 'Use the developer to implement [feature] from spec',
        vi: 'Nhờ agent developer triển khai [tính năng] từ đặc tả',
      },
    },
    summary: {
      en: 'Ship production code from PRD, design spec, or agent brief — solution ladder then TDD at confirmed seams, scope self-check before done, status report on multi-slice work, tight debug loops.',
      vi: 'Đưa code sẵn sàng chạy thật từ PRD, đặc tả thiết kế, hoặc tóm tắt cho agent — leo thang giải pháp rồi TDD tại các seam đã chốt, tự kiểm phạm vi trước khi xong, báo cáo trạng thái cho việc nhiều lát cắt, và vòng gỡ lỗi chặt.',
    },
    whenToUse: {
      en: 'Spec is ready (`ready-for-agent` issue, PRD, or `docs/design/`). Pick up vertical slices.',
      vi: 'Đặc tả đã sẵn sàng (issue `ready-for-agent`, PRD, hoặc `docs/design/`). Nhận việc theo từng lát cắt dọc.',
    },
    pipeline: {
      upstream: '/design hoặc agent brief từ `/triage`',
      downstream: '/code-review',
    },
    boundaries: {
      en: 'Not requirements or UI spec authoring. Pre-merge review is `code-review`, not part of the dev loop.',
      vi: 'Không viết yêu cầu hay đặc tả giao diện. Rà soát trước khi gộp nhánh là việc của `code-review`, không nằm trong vòng `/dev`.',
    },
  },
  {
    name: 'code-review',
    invoke: '/code-review',
    slug: 'code-review',
    description: {
      en: 'Review code changes since a pinned git fixed point — Standards, Spec, and Simplify axes.',
      vi: 'Rà soát thay đổi code từ một điểm mốc git cố định — theo ba trục Chuẩn mực, Đặc tả, và Đơn giản hóa.',
    },
    status: 'available',
    invocation: 'model',
    domain: 'review',
    samplePrompt: '/code-review\n\nReview diff since main.\nRà soát code trên branch này so với main.',
    githubPath: 'skills/code-review/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: { en: 'PRINCIPAL TECH LEAD', vi: 'TRƯỞNG KỸ THUẬT CHÍNH' },
      owns: ['Standards', 'Spec', 'Simplify', 'pre-merge gate'],
      invokeHint: {
        en: 'Use the techlead to review diff since main',
        vi: 'Nhờ agent techlead rà soát diff so với main',
      },
    },
    summary: {
      en: 'Three-axis review (Standards + Spec + Simplify) since a pinned git point — parallel sub-agents, findings tagged 🔴 blocker / 🟡 suggestion / 💭 nit.',
      vi: 'Rà soát theo ba trục (Chuẩn mực + Đặc tả + Đơn giản hóa) từ một điểm git cố định — chạy song song bằng subagent, kết quả gắn nhãn 🔴 chặn / 🟡 gợi ý / 💭 nhỏ.',
    },
    whenToUse: {
      en: 'Before merge or when asked to review a branch, PR, or diff — including over-engineering cuts.',
      vi: 'Trước khi gộp nhánh, hoặc khi được yêu cầu rà soát một nhánh, PR, hoặc diff — kể cả để cắt bớt phần thiết kế thừa.',
    },
    pipeline: {
      upstream: '/dev',
      downstream: { en: 'Ship', vi: 'Đưa lên môi trường chạy thật' },
    },
    boundaries: {
      en: 'Not lint-only or generic PR comment — pinned baseline; Spec optional; Simplify always runs.',
      vi: 'Không chỉ là lint hay nhận xét PR chung — có điểm neo cố định; Đặc tả là tùy chọn; Đơn giản hóa luôn chạy.',
    },
  },
  {
    name: 'docs',
    invoke: '/docs',
    slug: 'docs',
    description: {
      en: 'Developer-facing documentation — API reference, tutorials, integration guides, migration notes.',
      vi: 'Tài liệu dành cho lập trình viên — tham chiếu API, hướng dẫn, tích hợp, ghi chú migration.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'docs',
    samplePrompt:
      '/docs\n\nWrite a tutorial: wire Cursor to the kit MCP and search Knowledge with intent: incident.',
    githubPath: 'skills/docs/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: { en: 'PRINCIPAL TECH LEAD', vi: 'TRƯỞNG KỸ THUẬT CHÍNH' },
      owns: ['API reference', 'tutorials', 'integration guides', 'migration notes'],
      invokeHint: { en: 'Use the techlead to [task]', vi: 'Nhờ agent techlead làm [công việc]' },
    },
    summary: {
      en: 'Developer-facing docs for shipped surfaces — verify examples against code; not PRDs or feature implementation.',
      vi: 'Tài liệu cho lập trình viên về những bề mặt đã đưa đi — kiểm tra ví dụ khớp với code thật; không phải PRD hay triển khai tính năng.',
    },
    whenToUse: {
      en: 'Public/integrator docs after a surface ships, or when API/tutorial drift is found.',
      vi: 'Viết tài liệu công khai hoặc cho bên tích hợp sau khi bề mặt đã đưa đi, hoặc khi phát hiện API hay hướng dẫn bị lệch so với code.',
    },
    pipeline: {
      upstream: {
        en: '/dev (shipped seam) or existing schema/MCP',
        vi: '/dev (seam đã đưa đi) hoặc schema/MCP đã có',
      },
      downstream: {
        en: 'Published docs path / optional `/e2e` how-to',
        vi: 'Đường tài liệu đã xuất bản / tùy chọn viết hướng dẫn cho `/e2e`',
      },
    },
    boundaries: {
      en: 'Not `/reqs` requirements. Not `/dev` feature code. Not marketing copy.',
      vi: 'Không viết yêu cầu (đó là `/reqs`). Không viết code tính năng (đó là `/dev`). Không viết nội dung tiếp thị.',
    },
  },
  {
    name: 'e2e',
    invoke: '/e2e',
    slug: 'e2e',
    description: {
      en: 'End-to-end test automation — Playwright flake, CI parallelization, journey suites, traces.',
      vi: 'Tự động hóa kiểm thử đầu cuối — xử lý flaky Playwright, chạy CI song song, bộ hành trình, và trace.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'e2e',
    samplePrompt:
      '/e2e\n\nPlaywright CI flakes on checkout journey — stabilize waits and quarantine with owner.',
    githubPath: 'skills/e2e/',
    relatedAgents: ['tester'],
    agentPanel: {
      role: { en: 'PRINCIPAL TESTER', vi: 'KIỂM THỬ CHÍNH' },
      owns: ['Playwright suite', 'flake elimination', 'CI sharding', 'traces'],
      invokeHint: { en: 'Use the tester to [task]', vi: 'Nhờ agent tester làm [công việc]' },
    },
    summary: {
      en: 'E2E harness and CI test-job health — flakes, shards, journeys. Skill id `e2e`; agent id `tester`.',
      vi: 'Khung E2E và sức khỏe job kiểm thử trên CI — flaky, phân mảnh, hành trình. Id skill là `e2e`; id agent là `tester`.',
    },
    whenToUse: {
      en: 'Flaky or slow E2E CI, new critical journey coverage, trace-driven triage of test jobs.',
      vi: 'CI E2E không ổn định hoặc chạy chậm, cần thêm độ bao phủ cho hành trình quan trọng, hoặc sàng lọc job kiểm thử dựa trên trace.',
    },
    pipeline: {
      upstream: { en: 'CI test failure or suite map', vi: 'CI kiểm thử lỗi hoặc bản đồ bộ kiểm thử' },
      downstream: '/dev (product bug) · `/devops` (deploy) · `/code-review`',
    },
    boundaries: {
      en: 'Not seam TDD (`/dev`). Not deploy/build Knowledge fixes (`/devops`). Not pre-merge three-axis review.',
      vi: 'Không phải TDD ở seam (đó là `/dev`). Không phải sửa Knowledge cho deploy hay bản dựng (đó là `/devops`). Không phải rà soát ba trục trước khi gộp nhánh.',
    },
  },
  {
    name: 'craft',
    invoke: '/craft',
    slug: 'craft',
    description: {
      en: 'Reference for writing and editing ai-kit skills — predictability, invocation, pruning.',
      vi: 'Tài liệu tham khảo để viết và sửa skill của ai-kit — tính dự đoán được, cách gọi lệnh, và cắt giảm lan man.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'authoring',
    samplePrompt: '/craft\n\nReview skills/reqs/SKILL.md for sprawl and no-ops.',
    githubPath: 'skills/craft/',
    summary: {
      en: 'Author and edit ai-kit skills — invocation rules, predictability, sprawl control, and pruning.',
      vi: 'Viết và sửa skill cho ai-kit — quy tắc gọi lệnh, tính dự đoán được, kiểm soát lan man, và cắt gọt.',
    },
    whenToUse: {
      en: 'Creating or refactoring skills under `skills/` or `agents/`.',
      vi: 'Khi tạo mới hoặc tái cấu trúc skill trong `skills/` hoặc `agents/`.',
    },
    pipeline: {
      upstream: { en: 'Skill or agent file to improve', vi: 'File skill hoặc agent cần cải thiện' },
      downstream: { en: 'Committed skill changes', vi: 'Thay đổi skill đã commit' },
    },
    boundaries: {
      en: 'Not product features in application repos — meta-authoring for ai-kit only.',
      vi: 'Không phải tính năng sản phẩm trong các repo ứng dụng — chỉ dùng để biên soạn meta cho ai-kit.',
    },
  },
  {
    name: 'arch-refactor',
    invoke: '/arch-refactor',
    slug: 'arch-refactor',
    description: {
      en: 'Scan codebase for deepening opportunities, present visual HTML report, then grill the candidate you pick.',
      vi: 'Quét codebase để tìm cơ hội làm sâu module, xuất báo cáo HTML trực quan, rồi hỏi xoáy ứng viên bạn chọn.',
    },
    status: 'available',
    invocation: 'user',
    domain: 'architecture',
    samplePrompt: '/arch-refactor\n\nRà soát kiến trúc — tìm chỗ deepen module.',
    githubPath: 'skills/arch-refactor/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: { en: 'PRINCIPAL TECH LEAD', vi: 'TRƯỞNG KỸ THUẬT CHÍNH' },
      owns: ['deepening scan', 'HTML report', 'grill candidate'],
      invokeHint: {
        en: 'Use the techlead to scan for deepening opportunities',
        vi: 'Nhờ agent techlead quét tìm cơ hội làm sâu module',
      },
    },
    summary: {
      en: 'Maintenance scan for module deepening — HTML report, then grill the candidate you choose.',
      vi: 'Quét bảo trì để tìm cơ hội làm sâu module — xuất báo cáo HTML, rồi hỏi xoáy ứng viên bạn chọn.',
    },
    whenToUse: {
      en: 'Refactor or architecture improvement pass on an existing codebase.',
      vi: 'Khi cần một vòng tái cấu trúc hoặc cải thiện kiến trúc cho codebase hiện có.',
    },
    pipeline: {
      upstream: { en: 'Codebase with deepening debt', vi: 'Codebase đang có nợ làm sâu' },
      downstream: {
        en: '/align or `/dev` on chosen candidate',
        vi: '/align hoặc `/dev` cho ứng viên đã chọn',
      },
    },
    boundaries: {
      en: 'Not greenfield architecture vocabulary — that is model-invoked `arch`. Not `/dev` implementation by default.',
      vi: 'Không phải từ vựng kiến trúc cho dự án mới từ đầu — đó là `arch` (agent tự gọi). Mặc định cũng không tự triển khai như `/dev`.',
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
    status: 'available',
    invocation: 'model',
    domain: 'architecture',
    footnote: {
      en: 'Model-invoked — agent reaches via description when placing seams.',
      vi: 'Agent tự gọi — agent tìm tới skill này qua mô tả khi cần đặt seam hoặc làm sâu module.',
    },
    githubPath: 'skills/arch/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: { en: 'PRINCIPAL TECH LEAD', vi: 'TRƯỞNG KỸ THUẬT CHÍNH' },
      owns: ['seams', 'depth', 'leverage', 'design-it-twice'],
      invokeHint: {
        en: 'Use the techlead to place seams for [module]',
        vi: 'Nhờ agent techlead đặt seam cho [module]',
      },
    },
    summary: {
      en: 'Vocabulary for deep modules — seams, depth, leverage, locality. Other skills reach it when placing boundaries.',
      vi: 'Từ vựng cho module sâu — seam, depth, leverage, locality. Các skill khác gọi tới đây khi cần đặt ranh giới.',
    },
    whenToUse: {
      en: 'Automatically when designing module seams or deepening interfaces; invoke explicitly for architecture discussions.',
      vi: 'Tự động khi thiết kế seam cho module hoặc làm sâu giao diện module; gọi rõ ràng khi cần thảo luận về kiến trúc.',
    },
    pipeline: {
      upstream: { en: 'Implementation or design context', vi: 'Ngữ cảnh từ triển khai hoặc thiết kế' },
      downstream: {
        en: 'Informed `/dev` or `/design` decisions',
        vi: 'Quyết định có cơ sở cho `/dev` hoặc `/design',
      },
    },
    boundaries: {
      en: 'Not visual UI design. Not the arch-refactor maintenance scan workflow.',
      vi: 'Không phải thiết kế giao diện trực quan. Cũng không phải quy trình quét bảo trì của arch-refactor.',
    },
  },
  {
    name: 'devops',
    invoke: '/devops',
    slug: 'devops',
    description: {
      en: 'Deploy, CI, and infra — symptom → fix via Knowledge (`intent: incident`); SEV/post-mortem templates.',
      vi: 'Deploy, CI, và hạ tầng — đi từ triệu chứng tới cách xử lý qua Knowledge (`intent: incident`); có mẫu SEV/post-mortem.',
    },
    status: 'available',
    invocation: 'model',
    domain: 'devops',
    samplePrompt:
      '/devops\n\nVercel deploy failed on TanStack Start monorepo — search Knowledge (intent: incident) before changing config.',
    githubPath: 'skills/devops/',
    relatedAgents: ['developer', 'techlead'],
    agentPanel: {
      role: { en: 'PRINCIPAL ENGINEER · TECH LEAD', vi: 'KỸ SƯ CHÍNH · TRƯỞNG KỸ THUẬT CHÍNH' },
      owns: ['incident knowledge', 'stack profiles', 'deploy/CI fixes', 'SEV/post-mortem'],
      invokeHint: {
        en: 'Use the developer to [symptom] — or techlead for SEV ownership',
        vi: 'Nhờ agent developer xử lý [triệu chứng] — hoặc techlead nếu cần chủ trì SEV',
      },
    },
    summary: {
      en: 'Deploy, CI, and infra — retrieve Knowledge with `intent: incident`, apply symptom → cause → fix → verify, then close with SEV/status/post-mortem templates.',
      vi: 'Deploy, CI, và hạ tầng — truy xuất Knowledge với `intent: incident`, đi theo triệu chứng → nguyên nhân → cách xử lý → xác minh, rồi đóng lại bằng mẫu SEV/trạng thái/post-mortem.',
    },
    whenToUse: {
      en: 'Vercel/build failures, monorepo deploy traps, CI infra changes — search Knowledge (`intent: incident`) first.',
      vi: 'Deploy Vercel hoặc bản dựng lỗi, monorepo dính bẫy khi deploy, hoặc thay đổi hạ tầng CI — tìm Knowledge (`intent: incident`) trước tiên.',
    },
    pipeline: {
      upstream: {
        en: 'App deploy docs (e.g. `apps/*/DEPLOY.md`)',
        vi: 'Tài liệu deploy của ứng dụng (ví dụ `apps/*/DEPLOY.md`)',
      },
      downstream: {
        en: 'Verified deploy/CI green state (+ post-mortem when SEV1/SEV2)',
        vi: 'Trạng thái deploy/CI đã xác minh là xanh (+ post-mortem nếu SEV1/SEV2)',
      },
    },
    boundaries: {
      en: 'Not application feature code — operational playbooks and infra config. Design seams → `/arch`; feature work → `/dev`.',
      vi: 'Không phải code tính năng của ứng dụng — đây là sổ tay vận hành và cấu hình hạ tầng. Đặt seam thiết kế thì qua `/arch`; làm tính năng thì qua `/dev`.',
    },
  },
]
