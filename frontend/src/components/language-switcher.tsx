import type * as React from "react"

import { RuFlag, UsFlag } from "@/components/flags"
import { cn } from "@/lib/utils"
import type { Lang } from "@/lib/lang"

const LANG_FLAGS: Record<Lang, React.ComponentType<{ className?: string }>> = {
  ru: RuFlag,
  en: UsFlag,
}

function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Lang
  onChange: (lang: Lang) => void
}) {
  return (
    <div className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]">
      {(["ru", "en"] as const).map((value) => {
        const Flag = LANG_FLAGS[value]
        const active = lang === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            className={cn(
              "inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap uppercase transition-[color,box-shadow]",
              active
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            )}
          >
            <Flag className="h-3 w-4 shrink-0 rounded-[2px]" />
            {value}
          </button>
        )
      })}
    </div>
  )
}

export { LanguageSwitcher }
