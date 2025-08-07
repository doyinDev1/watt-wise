"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            >
                {src ? (
                    <img
                        className="aspect-square h-full w-full"
                        src={src}
                        alt={alt}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                        {fallback && (
                            <span className="text-sm font-medium text-muted-foreground">
                                {fallback}
                            </span>
                        )}
                    </div>
                )}
            </div>
        )
    }
)
Avatar.displayName = "Avatar"

export { Avatar } 