import type { DoctorCheck, DoctorReport } from './commands/doctor.ts'

/** `doctor` prints one line per check, then says what the whole report amounts to. */
export function formatDoctorReport(report: DoctorReport): string {
  const zh = report.locale === 'zh'
  const lines = [zh ? 'astryx-vue doctor — 只报告，不改文件' : 'astryx-vue doctor — reports only, changes nothing', '']
  for (const check of report.checks) {
    lines.push(`  ${marker(check)} ${check.detail}`)
    if (check.docsUrl && check.status !== 'ok')
      lines.push(`      ${zh ? '文档' : 'Docs'}: ${check.docsUrl}`)
  }
  lines.push('')
  lines.push(summary(report, zh))
  return `${lines.join('\n')}\n`
}

function marker(check: DoctorCheck): string {
  if (check.status === 'ok')
    return 'ok  '
  return check.status === 'warn' ? 'warn' : 'fail'
}

function summary(report: DoctorReport, zh: boolean): string {
  const failed = report.checks.filter(check => check.status === 'fail').length
  const warned = report.checks.filter(check => check.status === 'warn').length
  if (report.status === 'ok')
    return zh ? '全部通过。' : 'Everything checks out.'
  if (failed > 0) {
    return zh
      ? `${failed} 项没通过${warned > 0 ? `，${warned} 项要留意` : ''}。doctor 不会替你改文件。`
      : `${failed} check(s) failed${warned > 0 ? `, ${warned} to look at` : ''}. doctor does not change anything for you.`
  }
  return zh
    ? `全部通过，${warned} 项可以留意一下。`
    : `Nothing failed; ${warned} check(s) are worth a look.`
}
