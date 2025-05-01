import { NextRequest, NextResponse } from 'next/server'

// We'll make this optional to support both local and edge environments
export const config = {
    runtime: 'edge',
    // Adding these options helps with compatibility
    unstable_allowDynamic: [
        // This allows setTimeout to work in all environments
        '**/node_modules/lodash/**',
    ],
}

export async function POST(request: NextRequest) {
    try {
        const { hookUrl, message, delayTime, delayUnit, directSend } =
            await request.json()

        // Handle direct send mode (for client-delayed messages)
        if (directSend) {
            try {
                // Send the message immediately
                const response = await fetch(hookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: message,
                    }),
                })

                // Check response
                if (!response.ok) {
                    const responseText = await response.text()
                    console.error('Failed to send Slack message:', responseText)
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'Failed to send Slack message',
                        },
                        { status: 500 }
                    )
                }

                return NextResponse.json({
                    success: true,
                    message: 'Message sent successfully',
                    sentAt: new Date().toISOString(),
                })
            } catch (error) {
                console.error('Error sending direct message:', error)
                return NextResponse.json(
                    { error: 'Failed to send message' },
                    { status: 500 }
                )
            }
        }

        if (!hookUrl || !message || delayTime === undefined || !delayUnit) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Convert delay to milliseconds based on unit
        let delayMs = delayTime
        switch (delayUnit) {
            case 'seconds':
                delayMs = delayTime * 1000
                break
            case 'minutes':
                delayMs = delayTime * 60 * 1000
                break
            case 'hours':
                delayMs = delayTime * 60 * 60 * 1000
                break
            default:
                delayMs = delayTime * 1000
        }

        // Calculate scheduled time for reference
        const scheduledTime = new Date(Date.now() + delayMs)

        // Always use client-side approach for delays over 5 seconds
        // This gives consistent behavior in all environments
        const MAX_DELAY = 5 * 1000 // 5 seconds max to be safe

        if (delayMs > MAX_DELAY) {
            // For longer delays, we'll always use client-side approach for consistency
            return NextResponse.json({
                success: true,
                message: 'Using client-side delay',
                scheduledTime: scheduledTime.toISOString(),
                clientSideDelay: true,
                delayMs: delayMs,
                hookUrl: hookUrl,
                formattedMessage: `From Rowee's Slack Bot: ${message}`,
            })
        }

        // Handle short delays server-side
        try {
            // For very short delays, wait server-side
            await new Promise((resolve) => setTimeout(resolve, delayMs))

            // Send the message after the delay
            const response = await fetch(hookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: `From Rowee's Slack Bot: ${message}`,
                }),
            })

            // Check response
            if (!response.ok) {
                const responseText = await response.text()
                console.error('Failed to send Slack message:', responseText)
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Failed to send Slack message',
                    },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                success: true,
                message: 'Message sent successfully',
                scheduledTime: scheduledTime.toISOString(),
                sentAt: new Date().toISOString(),
            })
        } catch (error) {
            console.error('Server-side delay error:', error)

            // If server-side approach fails, fall back to client-side
            return NextResponse.json({
                success: true,
                message: 'Falling back to client-side delay',
                scheduledTime: scheduledTime.toISOString(),
                clientSideDelay: true,
                delayMs: delayMs,
                hookUrl: hookUrl,
                formattedMessage: `From Rowee's Slack Bot: ${message}`,
            })
        }
    } catch (error) {
        console.error('Error processing request:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}
