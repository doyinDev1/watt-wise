"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface AnimatedHeadlineProps {
    text: string
    className?: string
}

export default function AnimatedHeadline({ text, className }: AnimatedHeadlineProps) {
    const headlineRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!headlineRef.current) return

        const chars = headlineRef.current.querySelectorAll('.char')

        // Set initial state
        gsap.set(chars, { y: -100, opacity: 0 })

        // Create stagger animation
        gsap.to(chars, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.7)",
            delay: 0.5
        })
    }, [])

    // Split text into words, then each word into characters
    const words = text.split(' ')

    return (
        <div ref={headlineRef} className={`overflow-hidden ${className}`}>
            {words.map((word, wordIndex) => (
                <div key={wordIndex} className="inline-block mr-4 overflow-hidden">
                    {word.split('').map((char, charIndex) => (
                        <span
                            key={charIndex}
                            className="char inline-block"
                            style={{ whiteSpace: 'pre' }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    )
} 