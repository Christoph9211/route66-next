'use client'

import React from 'react'
import { scrollToSection } from '../utils/scrollToSection'

type ScrollLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    targetId: string
}

export default function ScrollLink({ targetId, onClick, href, ...rest }: ScrollLinkProps) {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        event.preventDefault()
        scrollToSection(targetId)
    }

    return (
        <a
            {...rest}
            href={href ?? `#${targetId}`}
            onClick={handleClick}
        />
    )
}
