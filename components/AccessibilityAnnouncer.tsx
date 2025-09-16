'use client';
import React, { useEffect, useRef } from 'react'

/**
 * Screen reader announcer for dynamic content changes
 */
export function ScreenReaderAnnouncer() {
    return (
        <div
            id="sr-announcer"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            role="status"
        />
    )
}

/**
 * AccessibilityAnnouncer is a React component that creates a live region for 
 * screen readers to announce messages to users. It is used to provide
 * important information to users that may not be visible to all users.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.message - The message to announce.
 * @param {string} [props.priority='polite'] - The priority of the announcement.
 * @param {number} [props.clearAfter=1000] - The time in milliseconds to clear
 * the announcement after.
 * @return {JSX.Element} The AccessibilityAnnouncer component.
 */

interface AccessibilityAnnouncerProps {
    message: string;
    priority?: "polite" | "off" | "assertive";
    clearAfter?: number;
}
function AccessibilityAnnouncer({ message, priority = 'polite', clearAfter = 1000 }: AccessibilityAnnouncerProps) {
    const announcerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (message && announcerRef.current) {
            announcerRef.current.textContent = message
            
            if (clearAfter > 0) {
                const timer = setTimeout(() => {
                    if (announcerRef.current) {
                        announcerRef.current.textContent = ''
                    }
                }, clearAfter)
                
                return () => clearTimeout(timer)
            }
        }
    }, [message, clearAfter])

    return (
        <div
            ref={announcerRef}
            aria-live={priority as "polite" | "off" | "assertive"}
            aria-atomic="true"
            className="sr-only"
            role="status"
        />
    )
}

export default AccessibilityAnnouncer