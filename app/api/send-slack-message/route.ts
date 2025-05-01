import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { hookUrl, message, delayTime, delayUnit } = await request.json()

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

        // Schedule the message
        const scheduledTime = new Date(Date.now() + delayMs)

        // For immediate testing/development, we can use setTimeout
        setTimeout(async () => {
            try {
                const response = await fetch(hookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: `From Rowee's Slack Bot: ${message}`,
                    }),
                })

                // Log the result for debugging
                const result = await response.text()
                // console.log('Slack API response:', response.status, result)

                if (!response.ok) {
                    console.error('Failed to send Slack message:', result)
                }
            } catch (error) {
                console.error('Error sending delayed Slack message:', error)
            }
        }, delayMs)

        return NextResponse.json({
            success: true,
            message: 'Message scheduled',
            scheduledTime: scheduledTime.toISOString(),
        })
    } catch (error) {
        console.error('Error processing request:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}
