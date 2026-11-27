import type { SkillOverlay } from './overlay'

/** Work packs also discoverable through the MCP catalog. */
export const workSkillOverlays: SkillOverlay[] = [
  {
    "name": "research",
    "invoke": "/research",
    "slug": "research",
    "description": {
      "en": "Investigate evidence, compare options and identify gaps in source quality.",
      "vi": "Nghiên cứu bằng chứng, so sánh phương án và xác định khoảng trống nguồn."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/research/",
    "summary": {
      "en": "Evidence-based research briefs with dated sources, comparable criteria and explicit uncertainty.",
      "vi": "Bản nghiên cứu dựa trên nguồn có ngày, tiêu chí so sánh thống nhất và bất định rõ ràng."
    },
    "whenToUse": {
      "en": "Market, technology or competitor questions requiring credible evidence.",
      "vi": "Khi cần nghiên cứu thị trường, công nghệ hay đối thủ dựa trên bằng chứng."
    },
    "boundaries": {
      "en": "Not a substitute for a short factual answer or a commercial decision.",
      "vi": "Không thay thế câu trả lời ngắn hay quyết định thương mại."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Define the question, scope and relevant time window.",
        "vi": "Xác định câu hỏi, phạm vi và khoảng thời gian."
      },
      {
        "en": "Read relevant sources and verify the actual claims and dates.",
        "vi": "Đọc nguồn liên quan, xác minh nội dung và ngày."
      },
      {
        "en": "Synthesize findings and limitations using consistent comparison criteria.",
        "vi": "Tổng hợp phát hiện và giới hạn theo tiêu chí thống nhất."
      }
    ],
    "doneWhen": {
      "en": "An actionable brief separates verified findings, inferences and unknowns.",
      "vi": "Bản nghiên cứu phân biệt dữ kiện đã xác minh, suy luận và điều chưa biết."
    },
    "samplePrompt": {
      "en": "Compare two HRM platforms using dated primary sources.",
      "vi": "So sánh hai nền tảng HRM bằng nguồn sơ cấp có ngày."
    }
  },
  {
    "name": "business",
    "invoke": "/business",
    "slug": "business",
    "description": {
      "en": "Evaluate pricing, unit economics, feasibility and strategic options.",
      "vi": "Đánh giá giá bán, unit economics, tính khả thi và phương án chiến lược."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/business/",
    "summary": {
      "en": "Decision analysis with consistent assumptions, auditable calculations and a proposed recommendation.",
      "vi": "Phân tích quyết định với giả định thống nhất, phép tính kiểm chứng được và đề xuất rõ."
    },
    "whenToUse": {
      "en": "Pricing, business case or investment decisions with competing options.",
      "vi": "Khi phân tích giá bán, business case hay các lựa chọn đầu tư."
    },
    "boundaries": {
      "en": "Does not approve decisions or change commercial settings by default.",
      "vi": "Không tự phê duyệt quyết định hay thay đổi cấu hình thương mại."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Define objectives, inputs and constraints.",
        "vi": "Xác định mục tiêu, đầu vào và ràng buộc."
      },
      {
        "en": "Compare options on the same cost basis and challenge material assumptions.",
        "vi": "So sánh các phương án cùng cơ sở chi phí và kiểm tra giả định quan trọng."
      },
      {
        "en": "Recommend an option and identify validation or revisit conditions.",
        "vi": "Đề xuất phương án và điều kiện kiểm chứng hoặc xem xét lại."
      }
    ],
    "doneWhen": {
      "en": "The recommendation is traceable to evidence and clearly proposed or approved.",
      "vi": "Đề xuất truy được về bằng chứng và phân biệt rõ với quyết định đã duyệt."
    },
    "samplePrompt": {
      "en": "Compare $10 and $15 plans at a 40% target margin.",
      "vi": "So sánh gói $10 và $15 với mục tiêu biên đóng góp 40%."
    }
  },
  {
    "name": "task",
    "invoke": "/task",
    "slug": "task",
    "description": {
      "en": "Draft actionable work items with bounded scope and testable acceptance criteria.",
      "vi": "Soạn task có phạm vi rõ và tiêu chí nghiệm thu kiểm chứng được."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/task/",
    "summary": {
      "en": "Self-contained tickets with context, deliverables, dependencies and independent acceptance criteria.",
      "vi": "Ticket độc lập có bối cảnh, kết quả cần giao, phụ thuộc và tiêu chí nghiệm thu."
    },
    "whenToUse": {
      "en": "New work items, standard task breakdowns or dependency-ordered vertical slices from an approved PRD.",
      "vi": "Khi cần ticket mới, chia task hoặc tách PRD đã duyệt thành các lát dọc có phụ thuộc."
    },
    "boundaries": {
      "en": "Use bug for defects and track for changes to existing tickets; draft by default.",
      "vi": "Dùng bug cho lỗi, track để sửa ticket hiện có; mặc định chỉ soạn nháp."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Read the request and related requirements or decisions.",
        "vi": "Đọc yêu cầu và đặc tả hoặc quyết định liên quan."
      },
      {
        "en": "Define one accountable outcome, scope and verifiable acceptance criteria.",
        "vi": "Xác định một kết quả, phạm vi và tiêu chí nghiệm thu kiểm chứng được."
      },
      {
        "en": "Draft or publish only to a resolved destination when authorized.",
        "vi": "Soạn nháp hoặc chỉ đăng vào đích đã xác định khi được phép."
      }
    ],
    "doneWhen": {
      "en": "The task is independently understandable and any publication is verified.",
      "vi": "Task có thể hiểu độc lập và việc đăng (nếu có) được xác minh."
    },
    "samplePrompt": {
      "en": "Draft a task to resend team invitations; do not publish.",
      "vi": "Soạn task gửi lại lời mời vào nhóm, không đăng ticket."
    }
  },
  {
    "name": "bug",
    "invoke": "/bug",
    "slug": "bug",
    "description": {
      "en": "Record observed defects with reproducible evidence and clear expected behavior.",
      "vi": "Ghi nhận lỗi quan sát được, bằng chứng tái hiện và hành vi mong đợi rõ ràng."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/bug/",
    "summary": {
      "en": "Defect reports distinguish actual behavior, expected behavior, reproduction and missing context.",
      "vi": "Báo cáo lỗi phân biệt thực tế, mong đợi, cách tái hiện và bối cảnh còn thiếu."
    },
    "whenToUse": {
      "en": "Observed failures or regressions needing a defect report.",
      "vi": "Khi quan sát lỗi hoặc regression cần lập báo cáo."
    },
    "boundaries": {
      "en": "Do not invent reproduction, cause or a successful fix; enhancements belong to task.",
      "vi": "Không bịa cách tái hiện, nguyên nhân hay kết quả sửa lỗi; cải tiến thuộc task."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Collect the observed symptom, scope and known environment.",
        "vi": "Thu thập triệu chứng, phạm vi và môi trường đã biết."
      },
      {
        "en": "Separate expected and actual behavior; record reproduction evidence and unknowns.",
        "vi": "Tách hành vi mong đợi và thực tế; ghi bằng chứng tái hiện và điều chưa biết."
      },
      {
        "en": "Draft a report and check duplicates before authorized creation.",
        "vi": "Soạn báo cáo và kiểm tra trùng trước khi tạo ticket được phép."
      }
    ],
    "doneWhen": {
      "en": "The report states the evidence and explicitly labels gaps without guessing.",
      "vi": "Báo cáo ghi rõ bằng chứng và khoảng trống, không suy đoán thành dữ kiện."
    },
    "samplePrompt": {
      "en": "Report a blank screen after clicking Save in staging.",
      "vi": "Báo lỗi màn hình trắng khi bấm Save trên staging."
    }
  },
  {
    "name": "track",
    "invoke": "/track",
    "slug": "track",
    "description": {
      "en": "Inspect, update or triage work items and external PRs with verified transitions.",
      "vi": "Đọc, cập nhật hoặc triage ticket và PR ngoài với chuyển trạng thái đã xác minh."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/track/",
    "summary": {
      "en": "Tracker operations resolve exact targets, preserve unrelated fields and distinguish writes from verification.",
      "vi": "Thao tác tracker xác định đúng đối tượng, giữ nguyên trường không liên quan và phân biệt ghi với xác minh."
    },
    "whenToUse": {
      "en": "Inspect or update existing tickets, triage backlog, verify readiness or write agent briefs.",
      "vi": "Kiểm tra hoặc cập nhật ticket, triage backlog, xác minh readiness hoặc viết agent brief."
    },
    "boundaries": {
      "en": "Use task or bug for new work; never infer a successful write or readback.",
      "vi": "Dùng task hoặc bug cho việc mới; không suy diễn ghi hay đọc lại thành công."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Resolve the project, filters and exact existing targets.",
        "vi": "Xác định dự án, bộ lọc và ticket hiện có."
      },
      {
        "en": "Read the latest fields and apply only requested changes when authorized.",
        "vi": "Đọc trường mới nhất và chỉ sửa phần được yêu cầu khi được phép."
      },
      {
        "en": "Verify supported readback and report successes, failures and unknowns separately.",
        "vi": "Đọc lại khi hỗ trợ và báo riêng thành công, thất bại, chưa xác minh."
      }
    ],
    "doneWhen": {
      "en": "The snapshot or change report matches actual tracker evidence and scope.",
      "vi": "Báo cáo hoặc snapshot khớp bằng chứng tracker và phạm vi thực tế."
    },
    "samplePrompt": {
      "en": "Summarize open tickets in this project without changing them.",
      "vi": "Tổng hợp các ticket đang mở của dự án, không sửa."
    }
  },
  {
    "name": "plan",
    "invoke": "/plan",
    "slug": "plan",
    "description": {
      "en": "Estimate effort, dependencies, capacity and milestones without false commitments.",
      "vi": "Ước lượng effort, phụ thuộc, năng lực và mốc tiến độ mà không cam kết sai."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/plan/",
    "summary": {
      "en": "Delivery plans reconcile person-days, dependency order and elapsed time under explicit assumptions.",
      "vi": "Kế hoạch cân đối person-days, thứ tự phụ thuộc và thời gian theo giả định rõ."
    },
    "whenToUse": {
      "en": "Effort estimates, delivery schedules or comparing phased delivery options.",
      "vi": "Khi cần estimate, lịch triển khai hoặc so sánh các phương án theo phase."
    },
    "boundaries": {
      "en": "Do not invent approved scope or divide effort blindly by team size.",
      "vi": "Không bịa phạm vi đã duyệt hay chia effort máy móc theo số người."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Confirm scope, capacity and known constraints.",
        "vi": "Xác định phạm vi, năng lực và ràng buộc đã biết."
      },
      {
        "en": "Break down work, estimate effort and map dependencies.",
        "vi": "Chia nhỏ công việc, ước lượng effort và lập quan hệ phụ thuộc."
      },
      {
        "en": "Reconcile totals and present a conditional schedule with risks.",
        "vi": "Đối chiếu tổng effort, trình bày lịch có điều kiện và rủi ro."
      }
    ],
    "doneWhen": {
      "en": "Effort totals reconcile and assumptions, dependencies and schedule limits are explicit.",
      "vi": "Tổng effort khớp, giả định, phụ thuộc và giới hạn tiến độ rõ ràng."
    },
    "samplePrompt": {
      "en": "Estimate delivery for two developers with dependent milestones.",
      "vi": "Ước lượng tiến độ cho hai dev với các mốc phụ thuộc."
    }
  },
  {
    "name": "qa",
    "invoke": "/qa",
    "slug": "qa",
    "description": {
      "en": "Design functional tests, verify UAT and environment-specific QA evidence.",
      "vi": "Thiết kế test chức năng, xác minh UAT và bằng chứng QA theo môi trường."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/qa/",
    "summary": {
      "en": "Test plans and cases trace to requirements, cover positive and negative behavior, and separate design from execution.",
      "vi": "Test plan và test case truy được về yêu cầu, có ca dương/âm và tách thiết kế với chạy test."
    },
    "whenToUse": {
      "en": "Test coverage, actual QA verification, UAT and environment-specific feature evidence.",
      "vi": "Độ phủ test, xác minh QA, UAT và bằng chứng tính năng theo môi trường."
    },
    "boundaries": {
      "en": "A planned test is not a passed test; use e2e for automation infrastructure.",
      "vi": "Test dự kiến không phải test đã pass; dùng e2e cho hạ tầng automation."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Read requirements, roles, environment and target build when known.",
        "vi": "Đọc yêu cầu, vai trò, môi trường và build đích nếu có."
      },
      {
        "en": "Write traceable cases with preconditions, steps and observable outcomes.",
        "vi": "Viết test case truy vết được với tiền điều kiện, bước và kết quả quan sát."
      },
      {
        "en": "Record actual execution evidence or mark cases Not run.",
        "vi": "Ghi bằng chứng chạy thực tế hoặc đánh dấu Not run."
      }
    ],
    "doneWhen": {
      "en": "Critical requirements have test coverage or explicit gaps, with honest execution status.",
      "vi": "Yêu cầu quan trọng có coverage hoặc khoảng trống rõ, trạng thái chạy trung thực."
    },
    "samplePrompt": {
      "en": "Write permission tests for owner-only workspace deletion.",
      "vi": "Viết test quyền chỉ owner được xóa workspace."
    }
  },
  {
    "name": "comms",
    "invoke": "/comms",
    "slug": "comms",
    "description": {
      "en": "Draft concise stakeholder messages, client replies and work updates.",
      "vi": "Soạn thông điệp ngắn gọn cho stakeholder, khách hàng và cập nhật công việc."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/comms/",
    "summary": {
      "en": "Communication that preserves factual status, decision boundaries and the requested tone or language.",
      "vi": "Thông điệp giữ đúng trạng thái thực tế, ranh giới quyết định và giọng điệu hoặc ngôn ngữ yêu cầu."
    },
    "whenToUse": {
      "en": "Client replies, ticket comments and stakeholder updates.",
      "vi": "Khi trả lời khách hàng, viết comment ticket hay cập nhật stakeholder."
    },
    "boundaries": {
      "en": "Draft by default; never send or promise an unapproved date without authorization.",
      "vi": "Mặc định soạn nháp; không tự gửi hay hứa thời hạn chưa duyệt."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Identify audience, objective, language and context.",
        "vi": "Xác định người nhận, mục tiêu, ngôn ngữ và bối cảnh."
      },
      {
        "en": "Separate confirmed facts from estimates and proposed decisions.",
        "vi": "Tách dữ kiện đã xác nhận khỏi ước lượng và đề xuất."
      },
      {
        "en": "Write the requested message and state send status when relevant.",
        "vi": "Soạn thông điệp theo yêu cầu và ghi trạng thái gửi nếu cần."
      }
    ],
    "doneWhen": {
      "en": "The message is accurate, usable and does not add unsupported commitments.",
      "vi": "Thông điệp chính xác, dùng được và không thêm cam kết thiếu căn cứ."
    },
    "samplePrompt": {
      "en": "Draft a bilingual client reply about an estimate pending research.",
      "vi": "Soạn phản hồi khách hàng song ngữ về estimate đang chờ nghiên cứu."
    }
  },
  {
    "name": "review",
    "invoke": "/review",
    "slug": "review",
    "description": {
      "en": "Review non-code work artifacts and plans using evidence and actionable findings.",
      "vi": "Review tài liệu và kế hoạch bằng bằng chứng và đề xuất cụ thể."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/review/",
    "summary": {
      "en": "Evidence-based review of requirements, plans and proposals without silently changing accepted decisions.",
      "vi": "Rà soát yêu cầu, kế hoạch và đề xuất dựa trên bằng chứng, không tự đổi quyết định đã chốt."
    },
    "whenToUse": {
      "en": "Review requirements, proposals and plans for assumptions, gaps, risks and evidence.",
      "vi": "Rà yêu cầu, đề xuất và kế hoạch để tìm giả định, khoảng trống, rủi ro và bằng chứng."
    },
    "boundaries": {
      "en": "Use code-review for source changes and qa for functional test execution.",
      "vi": "Dùng code-review cho mã nguồn và qa để chạy test chức năng."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Read the artifact, goal, constraints and sources.",
        "vi": "Đọc tài liệu, mục tiêu, ràng buộc và nguồn."
      },
      {
        "en": "Identify material contradictions, gaps and unsupported assumptions.",
        "vi": "Xác định mâu thuẫn, khoảng trống và giả định thiếu căn cứ."
      },
      {
        "en": "Prioritize findings by impact and propose verification or fixes.",
        "vi": "Ưu tiên phát hiện theo tác động, đề xuất cách kiểm chứng hoặc sửa."
      }
    ],
    "doneWhen": {
      "en": "Findings are actionable and evidence-backed; review is not approval.",
      "vi": "Phát hiện có thể hành động và có bằng chứng; review không phải phê duyệt."
    },
    "samplePrompt": {
      "en": "Review a proposed pricing change for hidden assumptions.",
      "vi": "Rà soát đề xuất đổi giá để tìm giả định chưa rõ."
    }
  },
  {
    "name": "release",
    "invoke": "/release",
    "slug": "release",
    "description": {
      "en": "Assess go-live readiness, rollout, rollback and release notes from evidence.",
      "vi": "Đánh giá readiness go-live, rollout, rollback và release notes dựa trên bằng chứng."
    },
    "invocation": "model",
    "domain": "work",
    "githubPath": "skills/release/",
    "summary": {
      "en": "Release gate reports distinguish preview from production, actual QA from planned work, and readiness from approval.",
      "vi": "Báo cáo release phân biệt preview với production, QA thực tế với kế hoạch, readiness với phê duyệt."
    },
    "whenToUse": {
      "en": "Release checklists, readiness decisions and rollout or rollback planning.",
      "vi": "Khi cần checklist release, quyết định readiness hay kế hoạch rollout/rollback."
    },
    "boundaries": {
      "en": "Does not deploy, merge or approve a release merely because readiness was assessed.",
      "vi": "Không tự deploy, merge hay duyệt release chỉ vì đã đánh giá readiness."
    },
    "prerequisites": [
      {
        "en": "Relevant request, source context and explicit authorization for any external writes.",
        "vi": "Yêu cầu và ngữ cảnh liên quan, có quyền rõ ràng nếu cần ghi ra hệ thống ngoài."
      }
    ],
    "howTo": [
      {
        "en": "Identify release scope, target environment and build.",
        "vi": "Xác định phạm vi release, môi trường đích và build."
      },
      {
        "en": "Reconcile actual test, deployment and rollback evidence against gates.",
        "vi": "Đối chiếu bằng chứng test, deploy và rollback với các gate."
      },
      {
        "en": "Report blockers, conditional status and the next authorized action.",
        "vi": "Báo blocker, trạng thái có điều kiện và bước được phép tiếp theo."
      }
    ],
    "doneWhen": {
      "en": "Readiness is evidence-backed and missing critical evidence never becomes a pass.",
      "vi": "Readiness có bằng chứng; thiếu bằng chứng quan trọng không được coi là pass."
    },
    "samplePrompt": {
      "en": "Assess go-live: preview passed, production and functional QA pending.",
      "vi": "Đánh giá go-live: preview pass, production và QA chức năng chưa xong."
    }
  }
]
