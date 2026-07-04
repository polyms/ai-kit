import { Button, Toast } from '@polyms/core-ui'
import { copyText } from '../lib/copy'
import { trackEvent } from '../lib/umami'
import { useT } from '../lib/i18n'
import { IconCopy } from '../lib/icons'

type CopyPromptButtonProps = {
  text: string
  skill?: string
  source?: string
  className?: string
}

export function CopyPromptButton({ text, skill, source = 'detail', className }: CopyPromptButtonProps) {
  const t = useT()
  const toastManager = Toast.useToastManager()

  const handleCopy = async () => {
    const ok = await copyText(text)
    if (ok) {
      toastManager.add({
        title: t('catalog.copied'),
        type: 'success',
      })
      trackEvent('copy_prompt', { skill: skill ?? 'unknown', source })
    } else {
      toastManager.add({
        title: t('catalog.copyFail'),
        type: 'danger',
      })
    }
  }

  return (
    <Button
      type='button'
      size='sm'
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 ${className ?? ''}`}
    >
      <IconCopy size={16} aria-hidden />
      {t('catalog.copy')}
    </Button>
  )
}
