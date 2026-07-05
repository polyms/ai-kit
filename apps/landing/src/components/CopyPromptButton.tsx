import { Button, Toast } from '@polyms/core-ui'
import { copyText } from '../lib/copy'
import { IconCopy } from '../lib/icons'
import { trackEvent } from '../lib/umami'
import { m } from '../paraglide/messages.js'

type CopyPromptButtonProps = {
  text: string
  skill?: string
  source?: string
  className?: string
}

export function CopyPromptButton({ text, skill, source = 'detail', className }: CopyPromptButtonProps) {
  const toastManager = Toast.useToastManager()

  const handleCopy = async () => {
    const ok = await copyText(text)
    if (ok) {
      toastManager.add({
        title: m.catalog_copied(),
        type: 'success',
      })
      trackEvent('copy_prompt', { skill: skill ?? 'unknown', source })
    } else {
      toastManager.add({
        title: m.catalog_copyFail(),
        type: 'danger',
      })
    }
  }

  return (
    <Button
      className={`inline-flex items-center gap-1.5 ${className ?? ''}`}
      onClick={handleCopy}
      size='sm'
      type='button'
    >
      <IconCopy aria-hidden size={16} />
      {m.catalog_copy()}
    </Button>
  )
}
