'use client'

import { z } from 'zod'

// Create a schema for the form input
const slackMessageFormSchema = z
    .object({
        delayInput: z.number().min(1, {
            message: 'Delay must be at least 1',
        }),
        delayUnit: z.enum(['seconds', 'minutes', 'hours'], {
            required_error: 'Please select a time unit',
        }),
        messageInput: z.string().min(1, {
            message: 'Message is required',
        }),
        hookUrlInput: z
            .string()
            .url({
                message: 'Please enter a valid URL',
            })
            .refine((url) => url.startsWith('https://hooks.slack.com/'), {
                message: 'URL must be a valid Slack webhook URL',
            }),
    })
    .refine(
        (data) => {
            // Convert to seconds for validation
            const seconds =
                data.delayUnit === 'seconds'
                    ? data.delayInput
                    : data.delayUnit === 'minutes'
                      ? data.delayInput * 60
                      : data.delayUnit === 'hours'
                        ? data.delayInput * 3600
                        : 0

            // Must be at least 5 seconds
            return seconds >= 5
        },
        {
            message:
                'Delay must be at least 5 seconds (or equivalent in minutes/hours)',
            path: ['delayInput'],
        }
    )
    .refine(
        (data) => {
            // Convert to seconds for validation
            const seconds =
                data.delayUnit === 'seconds'
                    ? data.delayInput
                    : data.delayUnit === 'minutes'
                      ? data.delayInput * 60
                      : data.delayUnit === 'hours'
                        ? data.delayInput * 3600
                        : 0

            // Must be less than 10 minutes (600 seconds)
            return seconds <= 600
        },
        {
            message:
                'Delay must be less than 10 minutes (or equivalent in seconds/hours)',
            path: ['delayInput'],
        }
    )

export default slackMessageFormSchema
