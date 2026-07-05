/** Client-safe ops env flags — no Node built-ins. */

export function isOpsDevBypassEnabled(): boolean {
  return process.env.OPS_DEV_BYPASS === 'true'
}
