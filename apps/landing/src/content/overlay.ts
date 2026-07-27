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
  tester: 'e2e',
  techlead: 'docs',
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
    prerequisites: [
      {
        en: 'ai-kit cloned and `pnpm bootstrap` already ran so `/setup` appears in Cursor.',
        vi: 'Đã clone ai-kit và chạy `pnpm bootstrap` để `/setup` hiện trong Cursor.',
      },
      {
        en: 'You are in the target project repo (not only the ai-kit repo).',
        vi: 'Bạn đang ở repo dự án đích (không chỉ repo ai-kit).',
      },
    ],
    howTo: [
      {
        en: 'In Cursor chat, type `/setup` (or paste the sample prompt).',
        vi: 'Trong chat Cursor, gõ `/setup` (hoặc dán prompt mẫu).',
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
        en: 'Restart or refresh the chat, then run `/align` or `/triage` as needed.',
        vi: 'Restart hoặc làm mới chat, rồi chạy `/align` hoặc `/triage` khi cần.',
      },
    ],
    doneWhen: {
      en: 'The repo has setup artifacts so `/to-prd`, `/to-issues`, and `/triage` can find the tracker and docs layout.',
      vi: 'Repo đã có artifact setup để `/to-prd`, `/to-issues`, và `/triage` tìm được tracker và bố cục docs.',
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
    invocation: 'user',
    domain: 'alignment',
    samplePrompt: {
      en: '/align\n\nGrill the plan for [feature].',
      vi: '/align\n\nGrill kế hoạch [feature].',
    },
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
      downstream: {
        en: '/reqs or /to-prd → /design → /dev',
        vi: '/reqs hoặc /to-prd → /design → /dev',
      },
    },
    boundaries: {
      en: 'Does not write a PRD — use `/reqs` for a full draft or `/to-prd` to publish a lean one. Does not implement code.',
      vi: 'Không viết PRD — dùng `/reqs` cho bản đầy đủ hoặc `/to-prd` để xuất bản bản gọn. Không implement code.',
    },
    prerequisites: [
      {
        en: 'Skills bootstrapped; `/setup` done if you will publish later.',
        vi: 'Đã bootstrap skill; đã `/setup` nếu sắp publish.',
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
        en: 'When decisions are clear, follow the `## Next Step` cue (`/reqs`, `/to-prd`, `/design`, or `/dev`).',
        vi: 'Khi quyết định đã rõ, làm theo gợi ý `## Next Step` (`/reqs`, `/to-prd`, `/design`, hoặc `/dev`).',
      },
    ],
    doneWhen: {
      en: 'Major forks are settled, domain words live in `CONTEXT.md`, and the next pipeline skill is named.',
      vi: 'Các nhánh quyết định lớn đã chốt, từ domain nằm trong `CONTEXT.md`, và skill pipeline tiếp theo đã được nêu.',
    },
    tips: [
      {
        en: 'Still need discovery or a long PRD? Next is `/reqs`. Aligned and ready to publish lean? Use `/to-prd`.',
        vi: 'Còn cần khám phá hoặc PRD dài? Tiếp là `/reqs`. Đã align và muốn publish bản gọn? Dùng `/to-prd`.',
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
      en: 'Requirements work — discovery, enterprise PRD, user stories, acceptance criteria, scope, and prioritization. Does not publish to the tracker.',
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
        en: 'When ready to publish a lean tracker PRD, invoke `/to-prd` (not `/reqs` again).',
        vi: 'Khi sẵn sàng publish PRD gọn lên tracker, gọi `/to-prd` (không gọi `/reqs` lại).',
      },
    ],
    doneWhen: {
      en: 'You have a testable PRD or story set in chat with explicit in/out of scope — still unpublished until `/to-prd`.',
      vi: 'Đã có PRD hoặc bộ story có AC trong chat, in/out of scope rõ — chưa publish cho tới `/to-prd`.',
    },
    tips: [
      {
        en: '`/reqs` drafts; `/to-prd` publishes. Do not expect `/reqs` to create a tracker issue.',
        vi: '`/reqs` soạn thảo; `/to-prd` xuất bản. Đừng kỳ vọng `/reqs` tạo issue trên tracker.',
      },
      {
        en: 'For deep PM work, ask to use the `pm` agent.',
        vi: 'Cho công việc PM sâu, nhờ dùng agent `pm`.',
      },
    ],
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
    samplePrompt: {
      en: '/to-prd\n\nLock the PRD from this chat.',
      vi: '/to-prd\n\nChốt PRD từ cuộc chat này.',
    },
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
    prerequisites: [
      {
        en: '`/setup` completed for this repo (tracker + auth via `gh` or configured CLI).',
        vi: 'Đã `/setup` cho repo này (tracker + auth qua `gh` hoặc CLI đã cấu hình).',
      },
      {
        en: 'An aligned chat (or settled decisions) ready to synthesize — not a blank discovery session.',
        vi: 'Chat đã align (hoặc quyết định đã chốt) sẵn để gói lại — không phải phiên discovery trống.',
      },
    ],
    howTo: [
      {
        en: 'In the same chat where you aligned, invoke `/to-prd`.',
        vi: 'Trong cùng chat đã align, gọi `/to-prd`.',
      },
      {
        en: 'Confirm the lean PRD draft the agent proposes.',
        vi: 'Xác nhận bản PRD gọn agent đề xuất.',
      },
      {
        en: 'Approve publishing — the skill creates the tracker issue (no extra interview).',
        vi: 'Duyệt publish — skill tạo issue trên tracker (không phỏng vấn thêm).',
      },
      {
        en: 'Save the issue link, then continue with `/to-issues` or `/design`.',
        vi: 'Lưu link issue, rồi tiếp `/to-issues` hoặc `/design`.',
      },
    ],
    doneWhen: {
      en: 'A lean PRD issue exists on the tracker and you have its URL or number.',
      vi: 'Đã có issue PRD gọn trên tracker và bạn có URL hoặc số issue.',
    },
    tips: [
      {
        en: 'Gaps remaining? Stop and run `/reqs` — `/to-prd` will not renegotiate scope.',
        vi: 'Còn thiếu? Dừng và chạy `/reqs` — `/to-prd` không đàm phán lại phạm vi.',
      },
      {
        en: 'Uses the lean PRD template, not the enterprise `/reqs` template.',
        vi: 'Dùng template PRD gọn, không phải template enterprise của `/reqs`.',
      },
    ],
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
    samplePrompt: '/to-issues\n\nPRD #42',
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
      upstream: {
        en: '/reqs or /to-prd',
        vi: '/reqs hoặc /to-prd',
      },
      downstream: {
        en: '/dev (via agent briefs or direct pickup)',
        vi: '/dev (qua tóm tắt cho agent hoặc nhận việc trực tiếp)',
      },
    },
    boundaries: {
      en: 'Does not triage raw backlog issues — that is `/triage`. Needs `/setup` first.',
      vi: 'Không sàng lọc issue backlog thô — đó là `/triage`. Cần `/setup` trước.',
    },
    prerequisites: [
      {
        en: '`/setup` done; tracker CLI working.',
        vi: 'Đã `/setup`; CLI tracker hoạt động.',
      },
      {
        en: 'An approved PRD, plan, or story set to slice (issue number or path).',
        vi: 'PRD, kế hoạch, hoặc bộ story đã duyệt để chia (số issue hoặc đường dẫn).',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/to-issues` and point at the PRD or plan (e.g. PRD #42).',
        vi: 'Gọi `/to-issues` và chỉ PRD hoặc kế hoạch (ví dụ PRD #42).',
      },
      {
        en: 'Review proposed vertical slices — adjust granularity when quizzed.',
        vi: 'Rà các lát cắt dọc đề xuất — chỉnh độ chi tiết khi được hỏi.',
      },
      {
        en: 'Approve publish; issues land with labels such as `ready-for-agent` when configured.',
        vi: 'Duyệt publish; issue được tạo kèm label như `ready-for-agent` nếu đã cấu hình.',
      },
      {
        en: 'Pick the first unblocked slice and hand off to `/dev`.',
        vi: 'Chọn lát cắt không bị chặn đầu tiên và giao cho `/dev`.',
      },
    ],
    doneWhen: {
      en: 'Independent tracker issues exist for each vertical slice and the first `/dev` target is clear.',
      vi: 'Đã có issue độc lập trên tracker cho mỗi lát cắt và mục tiêu `/dev` đầu tiên đã rõ.',
    },
    tips: [
      {
        en: '`/to-issues` creates slices from a spec; `/triage` processes inbound backlog.',
        vi: '`/to-issues` tạo lát cắt từ spec; `/triage` xử lý backlog đến.',
      },
      {
        en: 'Prefer one vertical slice per issue — avoid giant epics agents cannot finish.',
        vi: 'Ưu tiên một lát cắt dọc mỗi issue — tránh epic khổng lồ agent không xong nổi.',
      },
    ],
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
    samplePrompt: '/triage\n\nIssue #42',
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
    prerequisites: [
      {
        en: '`/setup` done with triage label mapping.',
        vi: 'Đã `/setup` kèm map label triage.',
      },
      {
        en: 'Raw or unverified issues already on the tracker.',
        vi: 'Đã có issue thô hoặc chưa xác minh trên tracker.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/triage` — ask what needs attention or name an issue (e.g. #42).',
        vi: 'Gọi `/triage` — hỏi việc cần chú ý hoặc nêu issue (ví dụ #42).',
      },
      {
        en: 'Confirm category, verification, and any grill questions.',
        vi: 'Xác nhận phân loại, xác minh, và câu hỏi xoáy nếu có.',
      },
      {
        en: 'Accept the agent brief when the issue reaches `ready-for-agent`.',
        vi: 'Chấp nhận tóm tắt agent khi issue đạt `ready-for-agent`.',
      },
      {
        en: 'Hand the brief to `/dev`.',
        vi: 'Giao tóm tắt cho `/dev`.',
      },
    ],
    doneWhen: {
      en: 'Target issues are categorized, verified, and either `ready-for-agent` or parked out of scope with a reason.',
      vi: 'Issue mục tiêu đã phân loại, xác minh, và hoặc `ready-for-agent` hoặc để out-of-scope kèm lý do.',
    },
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
        en: '/align → /reqs or /to-prd',
        vi: '/align → /reqs hoặc /to-prd',
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
      en: 'Build from a PRD, design spec, or agent brief: climb the solution ladder, write tests at the seams you confirmed, keep scope honest, and debug with a tight loop.',
      vi: 'Build từ PRD, đặc tả design, hoặc tóm tắt agent: leo thang giải pháp, viết test tại seam đã chốt, giữ phạm vi trung thực, và gỡ lỗi bằng vòng lặp chặt.',
    },
    whenToUse: {
      en: 'The spec is ready (`ready-for-agent` issue, PRD, or `docs/design/`). Pick up one vertical slice at a time.',
      vi: 'Đặc tả đã sẵn (`ready-for-agent`, PRD, hoặc `docs/design/`). Nhận từng lát cắt dọc một.',
    },
    pipeline: {
      upstream: {
        en: '/design or agent brief from `/triage`',
        vi: '/design hoặc agent brief từ `/triage`',
      },
      downstream: '/code-review',
    },
    boundaries: {
      en: 'Does not write requirements or UI specs. Pre-merge review is `/code-review`, not part of the `/dev` loop.',
      vi: 'Không viết yêu cầu hay đặc tả UI. Rà soát trước merge là `/code-review`, không nằm trong vòng `/dev`.',
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
        en: 'When the slice is green, run `/code-review` before merge.',
        vi: 'Khi lát cắt đã xanh, chạy `/code-review` trước khi merge.',
      },
    ],
    doneWhen: {
      en: 'The vertical slice is implemented with tests at confirmed seams and ready for `/code-review`.',
      vi: 'Lát cắt đã implement kèm test tại seam đã chốt và sẵn sàng cho `/code-review`.',
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
    name: 'code-review',
    invoke: '/code-review',
    slug: 'code-review',
    description: {
      en: 'Review code since a pinned git baseline — Standards, Spec, and Simplify.',
      vi: 'Rà soát code kể từ một mốc git cố định — theo Chuẩn mực, Đặc tả, và Đơn giản hóa.',
    },
    invocation: 'model',
    domain: 'review',
    samplePrompt: {
      en: '/code-review\n\nDiff since main',
      vi: '/code-review\n\nDiff so với main',
    },
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
    prerequisites: [
      {
        en: 'A branch or diff with a clear git baseline (e.g. `main`).',
        vi: 'Nhánh hoặc diff có baseline git rõ (ví dụ `main`).',
      },
      {
        en: 'Implementation for the slice is largely done (`/dev`).',
        vi: 'Phần implement lát cắt cơ bản đã xong (`/dev`).',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/code-review` and pin the baseline (e.g. review since `main`).',
        vi: 'Gọi `/code-review` và neo baseline (ví dụ rà kể từ `main`).',
      },
      {
        en: 'Let the three axes run — Standards, Spec (if provided), Simplify.',
        vi: 'Để ba trục chạy — Chuẩn mực, Đặc tả (nếu có), Đơn giản hóa.',
      },
      {
        en: 'Triage findings: fix blockers, consider suggestions, defer nits as needed.',
        vi: 'Phân loại finding: sửa blocker, cân nhắc gợi ý, để nits sau nếu cần.',
      },
      {
        en: 'Re-run or merge when blockers are clear.',
        vi: 'Chạy lại hoặc merge khi không còn blocker.',
      },
    ],
    doneWhen: {
      en: 'Findings are listed with severity and blockers are resolved or explicitly accepted before merge.',
      vi: 'Finding đã liệt kê theo mức độ và blocker đã xử lý hoặc chấp nhận rõ trước merge.',
    },
    tips: [
      {
        en: 'Always pin a baseline — “review this PR” without a base is not enough.',
        vi: 'Luôn neo baseline — “rà PR này” mà không có base là chưa đủ.',
      },
      {
        en: 'Long reviews: ask to use the `techlead` agent.',
        vi: 'Review dài: nhờ dùng agent `techlead`.',
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
        en: 'Published docs path / optional `/e2e` how-to',
        vi: 'Đường docs đã publish / tùy chọn hướng dẫn cho `/e2e`',
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
        en: 'Publish to the agreed docs path; optionally add an `/e2e` how-to if journeys matter.',
        vi: 'Publish vào đường docs đã chốt; tùy chọn thêm hướng dẫn `/e2e` nếu hành trình quan trọng.',
      },
    ],
    doneWhen: {
      en: 'Verified developer docs exist for the surface and examples match real code.',
      vi: 'Đã có docs developer đã kiểm chứng cho bề mặt đó và ví dụ khớp code thật.',
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
    samplePrompt: {
      en: '/e2e\n\nPlaywright CI flakes on checkout journey',
      vi: '/e2e\n\nPlaywright CI flaky trên hành trình checkout',
    },
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
    prerequisites: [
      {
        en: 'An E2E harness or CI test jobs (often Playwright) to stabilize or extend.',
        vi: 'Có khung E2E hoặc job test CI (thường Playwright) cần ổn định hoặc mở rộng.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/e2e` with the failing journey, flake symptom, or new coverage goal.',
        vi: 'Gọi `/e2e` kèm hành trình fail, triệu chứng flaky, hoặc mục tiêu cover mới.',
      },
      {
        en: 'Share CI links or traces when available.',
        vi: 'Chia sẻ link CI hoặc trace nếu có.',
      },
      {
        en: 'Confirm wait strategy, quarantine owner, or shard plan the agent proposes.',
        vi: 'Xác nhận chiến lược wait, owner quarantine, hoặc plan shard agent đề xuất.',
      },
      {
        en: 'Re-run CI; escalate product bugs to `/dev` or deploy issues to `/devops`.',
        vi: 'Chạy lại CI; escalate bug sản phẩm sang `/dev` hoặc lỗi deploy sang `/devops`.',
      },
    ],
    doneWhen: {
      en: 'The targeted journey is green or quarantined with an owner, and CI sharding/waits are documented if changed.',
      vi: 'Hành trình mục tiêu đã xanh hoặc quarantine kèm owner, và sharding/wait đã ghi nếu có đổi.',
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
    name: 'arch-refactor',
    invoke: '/arch-refactor',
    slug: 'arch-refactor',
    description: {
      en: 'Scan the codebase for deepening opportunities, show a visual HTML report, then grill the candidate you pick.',
      vi: 'Quét codebase tìm chỗ làm sâu module, hiện báo cáo HTML, rồi hỏi xoáy ứng viên bạn chọn.',
    },
    invocation: 'user',
    domain: 'architecture',
    samplePrompt: {
      en: '/arch-refactor\n\nFocus: [module area]',
      vi: '/arch-refactor\n\nFocus: [vùng module]',
    },
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
    prerequisites: [
      {
        en: 'An existing codebase with suspected deepening debt.',
        vi: 'Codebase hiện có với nợ làm sâu module nghi ngờ.',
      },
    ],
    howTo: [
      {
        en: 'Invoke `/arch-refactor` and describe the area to scan (or let it explore).',
        vi: 'Gọi `/arch-refactor` và mô tả vùng cần quét (hoặc để agent khám phá).',
      },
      {
        en: 'Open the HTML report in the OS temp directory when it is written.',
        vi: 'Mở báo cáo HTML trong thư mục temp của OS khi đã ghi xong.',
      },
      {
        en: 'Pick a candidate; answer the grill questions.',
        vi: 'Chọn một ứng viên; trả lời câu hỏi xoáy.',
      },
      {
        en: 'Hand off to `/align` or `/dev` for the chosen deepening work.',
        vi: 'Giao cho `/align` hoặc `/dev` cho việc làm sâu đã chọn.',
      },
    ],
    doneWhen: {
      en: 'You have a report plus a grilled candidate and a clear next skill (`/align` or `/dev`).',
      vi: 'Đã có báo cáo kèm ứng viên đã hỏi xoáy và skill tiếp theo rõ (`/align` hoặc `/dev`).',
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
        en: 'For a maintenance scan of deepening debt, use `/arch-refactor` instead.',
        vi: 'Để quét bảo trì nợ làm sâu, dùng `/arch-refactor` thay thế.',
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
]

