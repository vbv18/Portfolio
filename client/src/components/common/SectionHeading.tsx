import { Reveal } from '@/components/common/Reveal'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
    eyebrow: string
    title: string
    description?: string
    align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
    return (
        <Reveal className={cn('mb-14', align === 'center' && 'text-center')}>
            <div
                className={cn(
                    'mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent',
                    align === 'center' && 'justify-center',
                )}
            >
                <span className="h-px w-8 bg-accent" />
                {eyebrow}
            </div>
            <h2 className="font-display text-3xl font-medium text-balance text-ink md:text-4xl">{title}</h2>
            {description && (
                <p className={cn('mt-4 max-w-xl text-muted', align === 'center' && 'mx-auto')}>{description}</p>
            )}
        </Reveal>
    )
}
