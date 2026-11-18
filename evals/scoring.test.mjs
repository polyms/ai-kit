import test from 'node:test'
import assert from 'node:assert/strict'
import { scoreRoute, gradeOutput, scoreTrace, summarize } from './scoring.mjs'

const route={expected:['research','business'],avoid:['task'],ordered:true}
const names=['research','business','task']
test('routing scores exact selection, opt-out, duplicates and required order',()=>{
  assert.equal(scoreRoute(route,'{"skills":["research","business"]}',names).status,'pass')
  assert.equal(scoreRoute(route,'{"skills":["business","research"]}',names).status,'fail')
  assert.equal(scoreRoute(route,'{"skills":["research","business","research"]}',names).status,'fail')
  assert.deepEqual(scoreRoute(route,'{"skills":["research","task"]}',names).avoided,['task'])
  assert.equal(scoreRoute({expected:[],avoid:names},'{"skills":[]}',names).status,'pass')
  assert.throws(()=>scoreRoute(route,'{"skills":["unknown"]}',names))
})
const item={criteria:['quality'],hardGates:['scope preserved']}
const result=(a,b)=>JSON.stringify({grades:[{index:0,status:a,evidence:'observed A'},{index:1,status:b,evidence:'observed B'}]})
test('hard gates and unknown evidence never become a pass',()=>{
  assert.equal(gradeOutput(item,result('pass','pass')).status,'pass')
  assert.equal(gradeOutput(item,result('pass','fail')).status,'fail')
  assert.equal(gradeOutput(item,result('pass','unobservable')).status,'unverified')
  assert.equal(gradeOutput(item,result('fail','pass')).status,'fail')
  assert.throws(()=>gradeOutput(item,'{"grades":[]}'))
  assert.throws(()=>gradeOutput(item,'{"grades":[{"index":1,"status":"pass","evidence":"x"},{"index":0,"status":"pass","evidence":"y"}]}'))
})
test('trace aggregates actual loads and does not count manifest-only calls',()=>{
  const trace=[
    {name:'get_skill_pack',ok:true,args:{name:'task',paths:[]},loaded:[]},
    {name:'get_skill_pack',ok:true,args:{name:'qa',paths:['skills/qa/SKILL.md']},loaded:['skills/qa/SKILL.md']},
    {name:'get_skill_pack',ok:true,args:{name:'qa'},loaded:['skills/qa/SKILL.md']},
  ]
  const grade=scoreTrace({requiredSkills:['task'],skipSkills:['qa']},trace,'assisted')
  assert.deepEqual(grade.missing,['task'])
  assert.deepEqual(grade.avoided,['qa'])
  assert.equal(grade.fullLoads,1)
  assert.equal(grade.reloads,1)
  assert.equal(grade.status,'fail')
  assert.equal(scoreTrace({skill:'task'},[],'baseline').status,'not-applicable')
})
test('summary records unknown usage and unresolved scores separately',()=>{
  const rows=[{suite:'output',mode:'baseline',status:'unverified',elapsedMs:10,usage:null},
    {suite:'output',mode:'baseline',status:'error',elapsedMs:5,usage:null},
    {suite:'output',mode:'assisted',status:'pass',elapsedMs:20,usage:{inputTokens:10,outputTokens:5},trace:[{bytes:22}],traceScore:{status:'pass'}}]
  const s=summarize(rows)
  assert.equal(s['output:baseline'].usageReported,0)
  assert.equal(s['output:baseline'].unverified,1)
  assert.equal(s['output:baseline'].error,1)
  assert.equal(s['output:assisted'].inputTokens,10)
  assert.equal(s['output:assisted'].payloadBytes,22)
})
