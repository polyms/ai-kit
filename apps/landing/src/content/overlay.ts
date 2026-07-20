import type { Locale } from '../paraglide/runtime'

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
      en: 'Prepare a repo so ai-kit can find your issue tracker, domain docs, and agent pointers.',
      vi: 'Chuẩn bị repo để ai-kit biết issue tracker, tài liệu domain, và chỗ trỏ tới agent.',
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
      en: 'New repo, or the first time you wire ai-kit into a project. Run this before `/to-prd`, `/to-issues`, or `/triage`.',
      vi: 'Repo mới, hoặc lần đầu gắn ai-kit vào dự án. Chạy trước `/to-prd`, `/to-issues`, hoặc `/triage`.',
    },
    pipeline: {
      upstream: {
        en: 'Bootstrap (`bootstrap.sh`) — symlink skills into your editor',
        vi: 'Bootstrap (`bootstrap.sh`) — symlink skill vào editor',
      },
      downstream: {
        en: '/align, /reqs, /triage, and the rest of the pipeline',
        vi: '/align, /reqs, /triage, và các bước còn lại của pipeline',
      },
    },
    boundaries: {
      en: 'Does not install the skill symlinks — that is bootstrap. Does not handle day-to-day repo maintenance.',
      vi: 'Không cài symlink skill — việc đó là bootstrap. Cũng không phải bảo trì repo hàng ngày.',
    },
  },
  {
    name: 'align',
    invoke: '/align',
    slug: 'align',
    description: {
      en: 'Agree on the plan before you build — grill decisions one question at a time, sharpen domain words, update CONTEXT.md as you go.',
      vi: 'Thống nhất kế hoạch trước khi code — hỏi xoáy từng câu một, chốt từ domain, cập nhật CONTEXT.md ngay trong lúc làm.',
    },
    invocation: 'user',
    domain: 'alignment',
    samplePrompt: '/align\n\nGrill kế hoạch [feature] — một câu một lần, chọn A/B/C/D.',
    footnote: {
      en: 'Uses align-loop and domain-modeling under the hood (model-invoked). The grill stays in this chat — no subagent.',
      vi: 'Dùng align-loop và domain-modeling bên dưới (agent tự gọi). Hỏi xoáy diễn ra ngay trong chat này — không tách subagent.',
    },
    githubPath: 'skills/align/',
    summary: {
      en: 'Make fuzzy decisions explicit before `/reqs`, `/design`, or `/dev`, and land shared vocabulary in CONTEXT.md.',
      vi: 'Làm rõ quyết định mơ hồ trước `/reqs`, `/design`, hoặc `/dev`, rồi chốt từ vựng chung vào CONTEXT.md.',
    },
    whenToUse: {
      en: 'Before `/reqs`, `/to-prd`, `/design`, or `/dev` when scope, terms, or trade-offs are still fuzzy.',
      vi: 'Trước `/reqs`, `/to-prd`, `/design`, hoặc `/dev` khi phạm vi, thuật ngữ, hoặc đánh đổi còn mơ hồ.',
    },
    pipeline: {
      upstream: { en: 'Idea or rough plan', vi: 'Ý tưởng hoặc kế hoạch sơ bộ' },
      downstream: '/reqs hoặc /to-prd → /design → /dev',
    },
    boundaries: {
      en: 'Does not write a PRD — use `/reqs` for a full draft or `/to-prd` to publish a lean one. Does not implement code.',
      vi: 'Không viết PRD — dùng `/reqs` cho bản đầy đủ hoặc `/to-prd` để xuất bản bản gọn. Không implement code.',
    },
  },
  {
    name: 'reqs',
    invoke: '/reqs',
    slug: 'reqs',
    description: {
      en: 'Requirements work — discovery, enterprise PRD, user stories, acceptance criteria, scope, and prioritization. Does not publish to the tracker.',
      vi: 'Làm yêu cầu sản phẩm — khám phá, PRD đầy đủ, user story, tiêu chí chấp nhận, phạm vi, và ưu tiên. Không xuất bản lên tracker.',
    },
    invocation: 'user',
    domain: 'requirements',
    samplePrompt:
      '/reqs\n\nWrite an enterprise PRD for [feature].\nUsers: [who]. Success metric: [what]. Deadline: [when].',
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
      en: 'Turn ideas into specs engineers can build from — enterprise PRD and stories in chat. Publishing a lean PRD to the tracker is `/to-prd`.',
      vi: 'Biến ý tưởng thành đặc tả engineer build được — PRD đầy đủ và user story trong chat. Xuất bản PRD gọn lên tracker là việc của `/to-prd`.',
    },
    whenToUse: {
      en: 'When you still need discovery, a formal PRD, prioritization, or stakeholder-ready requirements — not the post-align publish path.',
      vi: 'Khi còn cần khám phá, PRD formal, sắp xếp ưu tiên, hoặc req sẵn sàng trình stakeholder — không phải đường xuất bản sau `/align`.',
    },
    pipeline: {
      upstream: { en: '/align (recommended)', vi: '/align (nên chạy trước)' },
      downstream: {
        en: '/to-prd (to publish), /to-issues, /design, /dev',
        vi: '/to-prd (để xuất bản), /to-issues, /design, /dev',
      },
    },
    boundaries: {
      en: 'Does not publish a lean PRD from chat — that is `/to-prd`. Does not design UI layout — that is `/design`.',
      vi: 'Không xuất bản PRD gọn từ chat — việc đó của `/to-prd`. Không thiết kế layout UI — đó là `/design`.',
    },
  },
  {
    name: 'to-prd',
    invoke: '/to-prd',
    slug: 'to-prd',
    description: {
      en: 'Turn the current conversation into a lean PRD and publish it as a tracker issue — no extra interview.',
      vi: 'Gói cuộc chat hiện tại thành PRD gọn và xuất bản thành issue trên tracker — không phỏng vấn thêm.',
    },
    invocation: 'user',
    domain: 'requirements',
    samplePrompt: '/to-prd\n\nChốt PRD từ cuộc chat này — publish lên GitHub.',
    githubPath: 'skills/to-prd/',
    summary: {
      en: 'When alignment is done, synthesize the chat into a lean PRD and create the tracker issue. No PM interview round.',
      vi: 'Khi đã align xong, gói chat thành PRD gọn và tạo issue trên tracker. Không vòng phỏng vấn PM thêm.',
    },
    whenToUse: {
      en: 'After `/align` when decisions are settled and you want a published PRD issue quickly.',
      vi: 'Sau `/align` khi quyết định đã chốt và bạn muốn có ngay issue PRD đã xuất bản.',
    },
    pipeline: {
      upstream: '/align',
      downstream: '/to-issues, /design',
    },
    boundaries: {
      en: 'Does not discover or renegotiate scope — use `/reqs` if gaps remain. Needs `/setup` first.',
      vi: 'Không khám phá hay đàm phán lại phạm vi — còn thiếu gì thì dùng `/reqs`. Cần `/setup` trước.',
    },
  },
  {
    name: 'to-issues',
    invoke: '/to-issues',
    slug: 'to-issues',
    description: {
      en: 'Break a plan, spec, or PRD into GitHub issues that can be picked up independently — one vertical slice per issue.',
      vi: 'Bẻ kế hoạch, đặc tả, hoặc PRD thành issue GitHub nhận việc độc lập được — mỗi issue một lát cắt dọc.',
    },
    invocation: 'user',
    domain: 'requirements',
    samplePrompt: '/to-issues\n\nBẻ PRD #42 thành issues — vertical slices, publish lên GitHub.',
    githubPath: 'skills/to-issues/',
    summary: {
      en: 'Split an approved PRD or plan into vertical-slice GitHub issues so people or agents can grab work without waiting on a giant epic.',
      vi: 'Chia PRD hoặc kế hoạch đã duyệt thành issue GitHub theo lát cắt dọc, để người hoặc agent nhận việc mà không chờ một epic khổng lồ.',
    },
    whenToUse: {
      en: 'The PRD or plan is approved and you need tracker-ready work items.',
      vi: 'PRD hoặc kế hoạch đã duyệt và bạn cần hạng mục công việc sẵn sàng trên tracker.',
    },
    pipeline: {
      upstream: '/reqs hoặc /to-prd',
      downstream: {
        en: '/dev (via agent briefs or direct pickup)',
        vi: '/dev (qua tóm tắt cho agent hoặc nhận việc trực tiếp)',
      },
    },
    boundaries: {
      en: 'Does not triage raw backlog issues — that is `/triage`. Needs `/setup` first.',
      vi: 'Không sàng lọc issue backlog thô — đó là `/triage`. Cần `/setup` trước.',
    },
  },
  {
    name: 'triage',
    invoke: '/triage',
    slug: 'triage',
    description: {
      en: 'Move GitHub issues through triage — categorize, verify, grill if needed, and attach agent briefs.',
      vi: 'Đưa issue GitHub qua sàng lọc — phân loại, xác minh, hỏi xoáy nếu cần, rồi gắn tóm tắt cho agent.',
    },
    invocation: 'user',
    domain: 'triage',
    samplePrompt:
      '/triage\n\nShow me what needs attention.\nPhân loại issue #42 — verify và viết agent brief.',
    githubPath: 'skills/triage/',
    summary: {
      en: 'Process raw GitHub issues until they are verified and ready for `/dev`, with briefs agents can follow.',
      vi: 'Xử lý issue GitHub thô đến khi đã xác minh và sẵn sàng cho `/dev`, kèm tóm tắt agent làm theo được.',
    },
    whenToUse: {
      en: 'The backlog has unverified issues, or you need `ready-for-agent` briefs before implementation.',
      vi: 'Backlog còn issue chưa xác minh, hoặc bạn cần tóm tắt `ready-for-agent` trước khi implement.',
    },
    pipeline: {
      upstream: { en: 'Raw GitHub issues', vi: 'Issue GitHub thô' },
      downstream: '/dev → /code-review',
    },
    boundaries: {
      en: 'Does not split a PRD into new issues — that is `/to-issues`. Needs `/setup` first.',
      vi: 'Không chia PRD thành issue mới — đó là `/to-issues`. Cần `/setup` trước.',
    },
  },
  {
    name: 'design',
    invoke: '/design',
    slug: 'design',
    description: {
      en: 'Turn a PRD or feature brief into an engineering-ready UI spec mapped to @polyms/core-ui.',
      vi: 'Biến PRD hoặc tóm tắt tính năng thành đặc tả UI sẵn sàng cho kỹ thuật, map theo @polyms/core-ui.',
    },
    invocation: 'user',
    domain: 'design',
    samplePrompt: '/design\n\nThiết kế màn hình từ PRD #42 — spec giao diện.',
    githubPath: 'skills/design/',
    relatedAgents: ['designer'],
    agentPanel: {
      role: 'PRINCIPAL DESIGNER',
      owns: ['docs/design/', '@polyms/core-ui component maps'],
      invokeHint: {
        en: 'Use the designer to spec UI from PRD #42',
        vi: 'Nhờ agent designer viết đặc tả giao diện từ PRD #42',
      },
    },
    summary: {
      en: 'Write UI specs at `docs/design/<feature>.md` — flows, empty/loading/error/success states, accessibility, and core-ui component maps.',
      vi: 'Viết đặc tả UI tại `docs/design/<feature>.md` — luồng, bốn trạng thái empty/loading/error/success, a11y, và map component core-ui.',
    },
    whenToUse: {
      en: 'A PRD exists and screens or flows need a spec before `/dev` ships UI.',
      vi: 'Đã có PRD và màn hình hoặc luồng cần đặc tả trước khi `/dev` ship UI.',
    },
    pipeline: {
      upstream: '/align → /reqs hoặc /to-prd',
      downstream: '/dev',
    },
    boundaries: {
      en: 'Does not rewrite product scope (`/reqs`). Does not place code seams (`arch`). Does not document the core-ui API (`/core-ui` in the lib repo).',
      vi: 'Không viết lại phạm vi sản phẩm (`/reqs`). Không đặt seam trong code (`arch`). Không viết tài liệu API core-ui (`/core-ui` ở lib repo).',
    },
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
    samplePrompt: '/dev\n\nImplement [feature] from PRD at docs/prd/feature-x.md',
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
      en: 'Build from a PRD, design spec, or agent brief: climb the solution ladder, write tests at the seams you confirmed, keep scope honest, and debug with a tight loop.',
      vi: 'Build từ PRD, đặc tả design, hoặc tóm tắt agent: leo thang giải pháp, viết test tại seam đã chốt, giữ phạm vi trung thực, và gỡ lỗi bằng vòng lặp chặt.',
    },
    whenToUse: {
      en: 'The spec is ready (`ready-for-agent` issue, PRD, or `docs/design/`). Pick up one vertical slice at a time.',
      vi: 'Đặc tả đã sẵn (`ready-for-agent`, PRD, hoặc `docs/design/`). Nhận từng lát cắt dọc một.',
    },
    pipeline: {
      upstream: '/design hoặc agent brief từ `/triage`',
      downstream: '/code-review',
    },
    boundaries: {
      en: 'Does not write requirements or UI specs. Pre-merge review is `/code-review`, not part of the `/dev` loop.',
      vi: 'Không viết yêu cầu hay đặc tả UI. Rà soát trước merge là `/code-review`, không nằm trong vòng `/dev`.',
    },
  },
  {
    name: 'code-review',
    invoke: '/code-review',
    slug: 'code-review',
    description: {
      en: 'Review code since a pinned git baseline — Standards, Spec, and Simplify.',
      vi: 'Rà soát code kể từ một mốc git cố định — theo Chuẩn mực, Đặc tả, và Đơn giản hóa.',
    },
    invocation: 'model',
    domain: 'review',
    samplePrompt: '/code-review\n\nReview diff since main.\nRà soát code trên branch này so với main.',
    githubPath: 'skills/code-review/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['Standards', 'Spec', 'Simplify', 'pre-merge gate'],
      invokeHint: {
        en: 'Use the techlead to review diff since main',
        vi: 'Nhờ agent techlead rà soát diff so với main',
      },
    },
    summary: {
      en: 'Three-axis review from a fixed git point — parallel subagents, findings tagged blocker / suggestion / nit.',
      vi: 'Rà soát ba trục từ một điểm git cố định — chạy song song bằng subagent, gắn nhãn chặn / gợi ý / nhỏ.',
    },
    whenToUse: {
      en: 'Before merge, or when asked to review a branch, PR, or diff — including cuts for over-engineering.',
      vi: 'Trước khi merge, hoặc khi được nhờ rà soát nhánh, PR, hoặc diff — kể cả để cắt phần over-engineer.',
    },
    pipeline: {
      upstream: '/dev',
      downstream: { en: 'Ship', vi: 'Ship' },
    },
    boundaries: {
      en: 'Not lint-only or generic PR comments — always uses a pinned baseline. Spec is optional; Simplify always runs.',
      vi: 'Không chỉ lint hay comment PR chung — luôn neo một baseline. Đặc tả là tùy chọn; Đơn giản hóa luôn chạy.',
    },
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
    samplePrompt:
      '/docs\n\nWrite a tutorial: wire Cursor to the kit MCP and search Knowledge with intent: incident.',
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
        en: 'Published docs path / optional `/e2e` how-to',
        vi: 'Đường docs đã publish / tùy chọn hướng dẫn cho `/e2e`',
      },
    },
    boundaries: {
      en: 'Does not write product requirements (`/reqs`). Does not implement features (`/dev`). Does not write marketing copy.',
      vi: 'Không viết yêu cầu sản phẩm (`/reqs`). Không implement feature (`/dev`). Không viết nội dung marketing.',
    },
  },
  {
    name: 'e2e',
    invoke: '/e2e',
    slug: 'e2e',
    description: {
      en: 'End-to-end test automation — Playwright flakes, CI parallelization, journey suites, and traces.',
      vi: 'Tự động hóa kiểm thử đầu cuối — flaky Playwright, chạy CI song song, bộ hành trình, và trace.',
    },
    invocation: 'user',
    domain: 'e2e',
    samplePrompt:
      '/e2e\n\nPlaywright CI flakes on checkout journey — stabilize waits and quarantine with owner.',
    githubPath: 'skills/e2e/',
    relatedAgents: ['tester'],
    agentPanel: {
      role: 'PRINCIPAL TESTER',
      owns: ['Playwright suite', 'flake elimination', 'CI sharding', 'traces'],
      invokeHint: { en: 'Use the tester to [task]', vi: 'Nhờ agent tester làm [công việc]' },
    },
    summary: {
      en: 'Keep the E2E harness and CI test jobs healthy — fix flakes, shard work, cover critical journeys. Skill id `e2e`; agent id `tester`.',
      vi: 'Giữ khung E2E và job test trên CI khỏe — sửa flaky, chia shard, cover hành trình quan trọng. Id skill là `e2e`; id agent là `tester`.',
    },
    whenToUse: {
      en: 'Flaky or slow E2E CI, new critical journey coverage, or trace-driven triage of failing test jobs.',
      vi: 'CI E2E flaky hoặc chậm, cần cover hành trình quan trọng mới, hoặc sàng lọc job fail dựa trên trace.',
    },
    pipeline: {
      upstream: { en: 'CI test failure or suite map', vi: 'CI test fail hoặc bản đồ bộ test' },
      downstream: '/dev (product bug) · `/devops` (deploy) · `/code-review`',
    },
    boundaries: {
      en: 'Not unit/seam TDD (`/dev`). Not deploy or build Knowledge fixes (`/devops`). Not the pre-merge three-axis review.',
      vi: 'Không phải TDD ở seam (`/dev`). Không sửa Knowledge cho deploy hay build (`/devops`). Không phải rà soát ba trục trước merge.',
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
    samplePrompt: '/craft\n\nReview skills/reqs/SKILL.md for sprawl and no-ops.',
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
  },
  {
    name: 'arch-refactor',
    invoke: '/arch-refactor',
    slug: 'arch-refactor',
    description: {
      en: 'Scan the codebase for deepening opportunities, show a visual HTML report, then grill the candidate you pick.',
      vi: 'Quét codebase tìm chỗ làm sâu module, hiện báo cáo HTML, rồi hỏi xoáy ứng viên bạn chọn.',
    },
    invocation: 'user',
    domain: 'architecture',
    samplePrompt: '/arch-refactor\n\nRà soát kiến trúc — tìm chỗ deepen module.',
    githubPath: 'skills/arch-refactor/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['deepening scan', 'HTML report', 'grill candidate'],
      invokeHint: {
        en: 'Use the techlead to scan for deepening opportunities',
        vi: 'Nhờ agent techlead quét tìm cơ hội làm sâu module',
      },
    },
    summary: {
      en: 'Maintenance pass: find modules that should go deeper, review them in an HTML report, then stress-test the one you choose.',
      vi: 'Vòng bảo trì: tìm module nên làm sâu hơn, xem trong báo cáo HTML, rồi stress-test ứng viên bạn chọn.',
    },
    whenToUse: {
      en: 'You want a focused refactor or architecture improvement pass on an existing codebase.',
      vi: 'Khi cần một vòng refactor hoặc cải thiện kiến trúc có trọng tâm trên codebase hiện có.',
    },
    pipeline: {
      upstream: { en: 'Codebase with deepening debt', vi: 'Codebase đang có nợ làm sâu' },
      downstream: {
        en: '/align or `/dev` on the chosen candidate',
        vi: '/align hoặc `/dev` cho ứng viên đã chọn',
      },
    },
    boundaries: {
      en: 'Not greenfield architecture vocabulary — that is model-invoked `arch`. Does not implement by default (`/dev`).',
      vi: 'Không phải từ vựng kiến trúc cho dự án mới — đó là `arch` (agent tự gọi). Mặc định không tự implement (`/dev`).',
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
      en: 'Shared words for deep modules — where the public interface sits, how deep it goes, what leverage it buys. Other skills reach for this when drawing boundaries.',
      vi: 'Từ chung cho module sâu — interface công khai nằm đâu, sâu tới đâu, leverage mang lại gì. Skill khác gọi tới đây khi cần vẽ ranh giới.',
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
      en: 'Not visual UI design. Not the arch-refactor maintenance scan.',
      vi: 'Không phải thiết kế giao diện. Cũng không phải vòng quét bảo trì của arch-refactor.',
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
    samplePrompt:
      '/devops\n\nVercel deploy failed on TanStack Start monorepo — search Knowledge (intent: incident) before changing config.',
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
  },
]
