'use client'

import { useEffect, useRef, useState } from 'react'

export default function AgeGate() {
    const [verified, setVerified] = useState(true)
    const yesBtnRef = useRef<HTMLButtonElement>(null)

    // Check cookie/localStorage for existing verification
    useEffect(() => {
        const hasCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('ageVerified='))
        const hasLocal = localStorage.getItem('ageVerified')
        if (!hasCookie && !hasLocal) {
            setVerified(false)
        }
    }, [])

    // Prevent background scroll when gate is active
    useEffect(() => {
        if (!verified) {
            document.body.style.overflow = 'hidden'
            yesBtnRef.current?.focus()
        } else {
            document.body.style.overflow = ''
        }
    }, [verified])

    const handleYes = () => {
        document.cookie = 'ageVerified=true; max-age=31536000; path=/'
        localStorage.setItem('ageVerified', 'true')
        setVerified(true)
    }

    const handleNo = () => {
        window.location.href = 'https://www.responsibility.org/'
    }

    if (verified) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="age-gate-title"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-center"
            >
                <h2 id="age-gate-title" className="mb-6 text-xl font-semibold">
                    Are you 21 or older?
                </h2>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                        ref={yesBtnRef}
                        onClick={handleYes}
                        className="flex-1 rounded bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-700"
                    >
                        Yes, 21 or older
                    </button>
                    <button
                        onClick={handleNo}
                        className="flex-1 rounded bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
                    >
                        I am under 21
                    </button>
                </div>
            </div>
        </div>
    )
}

