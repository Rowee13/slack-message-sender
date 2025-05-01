'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import slackMessageFormSchema from '@/schema/slack-message-form-schema'

// Track active deliveries (simple in-memory queue)
type ScheduledMessage = {
    id: string
    scheduledAt: Date
    deliveredAt: Date | null
    message: string // Store the message content for history
}

// Local storage key
const STORAGE_KEY = 'slack_message_history'

// Helper to load messages from localStorage
const loadMessagesFromStorage = (): ScheduledMessage[] => {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return []

        const parsed = JSON.parse(stored)
        return parsed.map(
            (msg: {
                id: string
                scheduledAt: string
                deliveredAt: string | null
                message: string
            }) => ({
                ...msg,
                scheduledAt: new Date(msg.scheduledAt),
                deliveredAt: msg.deliveredAt ? new Date(msg.deliveredAt) : null,
            })
        )
    } catch (error) {
        console.error('Error loading messages from storage:', error)
        return []
    }
}

// Helper to save messages to localStorage
const saveMessagesToStorage = (messages: ScheduledMessage[]) => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (error) {
        console.error('Error saving messages to storage:', error)
    }
}

const SendSlackMessageForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isMessageScheduled, setIsMessageScheduled] = useState(false)
    const [longDelayTimer, setLongDelayTimer] = useState<NodeJS.Timeout | null>(
        null
    )
    const [activeScheduledMessages, setActiveScheduledMessages] = useState<
        ScheduledMessage[]
    >([])
    const [nextDeliveryTime, setNextDeliveryTime] = useState<Date | null>(null)
    const [countdown, setCountdown] = useState<string>('')

    // Reference to track if component is mounted
    const isMounted = useRef(true)

    // Initialize messages from localStorage
    useEffect(() => {
        const storedMessages = loadMessagesFromStorage()
        if (storedMessages.length > 0) {
            setActiveScheduledMessages(storedMessages)
        }

        return () => {
            isMounted.current = false
        }
    }, [])

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (activeScheduledMessages.length > 0) {
            saveMessagesToStorage(activeScheduledMessages)
        }
    }, [activeScheduledMessages])

    // Cleanup any existing timers on unmount
    useEffect(() => {
        return () => {
            if (longDelayTimer) {
                clearTimeout(longDelayTimer)
            }
        }
    }, [longDelayTimer])

    // Update countdown timer at regular intervals
    useEffect(() => {
        const updateCountdown = () => {
            if (nextDeliveryTime) {
                setCountdown(getTimeRemaining())
            }
        }

        // Initial update
        updateCountdown()

        // Set up interval to update every second
        const intervalId = setInterval(updateCountdown, 1000)

        return () => {
            clearInterval(intervalId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextDeliveryTime])

    const form = useForm<z.infer<typeof slackMessageFormSchema>>({
        resolver: zodResolver(slackMessageFormSchema),
        defaultValues: {
            delayInput: 5,
            delayUnit: 'seconds',
            messageInput: '',
            hookUrlInput: '',
        },
        mode: 'onChange',
    })

    const { formState, reset, watch, trigger } = form
    const isFormValid = formState.isValid

    // Watch for changes to the delay unit and trigger validation
    const delayUnit = watch('delayUnit')

    useEffect(() => {
        // Trigger re-validation of delayInput whenever delayUnit changes
        trigger('delayInput')
    }, [delayUnit, trigger])

    // Calculate if any scheduled messages are pending
    const hasPendingMessages = activeScheduledMessages.some(
        (msg) => !msg.deliveredAt
    )

    // Update the next delivery time display
    useEffect(() => {
        if (hasPendingMessages) {
            const pendingMessages = activeScheduledMessages.filter(
                (msg) => !msg.deliveredAt
            )
            if (pendingMessages.length > 0) {
                // Find the earliest scheduled time
                const earliestDelivery = new Date(
                    Math.min(
                        ...pendingMessages.map((msg) =>
                            msg.scheduledAt.getTime()
                        )
                    )
                )
                setNextDeliveryTime(earliestDelivery)
            }
        } else {
            setNextDeliveryTime(null)
        }
    }, [activeScheduledMessages, hasPendingMessages])

    // Format countdown timer
    const getTimeRemaining = () => {
        if (!nextDeliveryTime) return ''

        const now = new Date()
        const timeRemaining = Math.max(
            0,
            nextDeliveryTime.getTime() - now.getTime()
        )

        if (timeRemaining === 0) return 'Delivering now...'

        const seconds = Math.floor((timeRemaining / 1000) % 60)
        const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60)
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60))

        return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`
    }

    const handleReset = () => {
        setIsMessageScheduled(false)
        reset({
            delayInput: 5,
            delayUnit: 'seconds',
            messageInput: '',
            hookUrlInput: '',
        })

        // We don't clear pending messages or timers here, we allow them to complete
    }

    // Clear message history
    const clearMessageHistory = () => {
        // Only clear delivered messages
        const pendingMessages = activeScheduledMessages.filter(
            (msg) => !msg.deliveredAt
        )
        setActiveScheduledMessages(pendingMessages)

        // Update localStorage
        saveMessagesToStorage(pendingMessages)

        if (pendingMessages.length === 0) {
            // If no pending messages, also clear localStorage
            localStorage.removeItem(STORAGE_KEY)
        }

        toast.success('Message history cleared!')
    }

    // Mark a message as delivered
    const markMessageDelivered = (messageId: string) => {
        if (!isMounted.current) return

        setActiveScheduledMessages((prev) => {
            const updated = prev.map((msg) =>
                msg.id === messageId ? { ...msg, deliveredAt: new Date() } : msg
            )

            // Save to localStorage
            saveMessagesToStorage(updated)

            return updated
        })
    }

    // Function to handle client-side delayed sending
    const handleClientSideDelay = async (
        messageId: string,
        delayMs: number,
        hookUrl: string,
        message: string
    ) => {
        const timer = setTimeout(async () => {
            if (!isMounted.current) return

            try {
                // Show notification that we're now sending the message
                toast.loading('Sending scheduled message now...', {
                    id: `sending-message-${messageId}`,
                })

                // Use our API endpoint instead of sending directly to Slack
                const response = await fetch('/api/send-slack-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        hookUrl: hookUrl,
                        message: message,
                        directSend: true, // This flag tells our API to send immediately
                    }),
                })

                if (isMounted.current) {
                    if (response.ok) {
                        toast.success('Delayed message sent successfully!', {
                            id: `sending-message-${messageId}`,
                        })
                        markMessageDelivered(messageId)
                    } else {
                        toast.error('Failed to send delayed message', {
                            id: `sending-message-${messageId}`,
                        })
                        markMessageDelivered(messageId) // Mark as delivered even if failed, to allow new messages
                    }
                }
            } catch (error) {
                if (isMounted.current) {
                    toast.error('Error sending delayed message', {
                        id: `sending-message-${messageId}`,
                    })
                    console.error('Client-side send error:', error)
                    markMessageDelivered(messageId) // Mark as delivered even if failed
                }
            }
        }, delayMs)

        setLongDelayTimer(timer)
    }

    async function onSubmit(values: z.infer<typeof slackMessageFormSchema>) {
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/send-slack-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hookUrl: values.hookUrlInput,
                    message: values.messageInput,
                    delayTime: values.delayInput,
                    delayUnit: values.delayUnit,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setIsMessageScheduled(true)

                // Generate a unique message ID
                const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

                // Calculate scheduled time
                const scheduledTime = new Date(data.scheduledTime)

                // Add to our tracking list
                setActiveScheduledMessages((prev) => {
                    const updated = [
                        ...prev,
                        {
                            id: messageId,
                            scheduledAt: scheduledTime,
                            deliveredAt: null,
                            message: values.messageInput,
                        },
                    ]

                    // Save to localStorage
                    saveMessagesToStorage(updated)

                    return updated
                })

                // Handle client-side delay if needed
                if (data.clientSideDelay) {
                    toast.success(
                        `Message scheduled in browser! It will be sent at ${scheduledTime.toLocaleTimeString()}`
                    )

                    // Set up client-side delay with only four parameters now
                    handleClientSideDelay(
                        messageId,
                        data.delayMs,
                        data.hookUrl,
                        data.formattedMessage
                    )
                } else {
                    // For server-side delays, we'll mark it as delivered after the expected time
                    toast.success(
                        `Message scheduled! It will be sent at ${scheduledTime.toLocaleTimeString()}`
                    )

                    // For server-handled delays, we set a client timer just to update the UI
                    // The actual delivery happens on the server
                    setTimeout(
                        () => {
                            if (isMounted.current) {
                                markMessageDelivered(messageId)
                                toast.success('Message delivered by server!')
                            }
                        },
                        Math.max(
                            100,
                            new Date(data.scheduledTime).getTime() -
                                Date.now() +
                                1000
                        )
                    )
                }
            } else {
                throw new Error(data.error || 'Failed to schedule message')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
                <div className='flex gap-2'>
                    <FormField
                        control={form.control}
                        name='delayInput'
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Delay</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder='5'
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='delayUnit'
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Unit</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select unit' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='seconds'>
                                            Seconds
                                        </SelectItem>
                                        <SelectItem value='minutes'>
                                            Minutes
                                        </SelectItem>
                                        <SelectItem value='hours'>
                                            Hours
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name='messageInput'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Input placeholder='Hello, world!' {...field} />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='hookUrlInput'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hook URL</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='https://hooks.slack.com/services/T00000000/B00000000/X00000000'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                        </FormItem>
                    )}
                />

                {hasPendingMessages && nextDeliveryTime && (
                    <div className='p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md text-center'>
                        <p className='text-amber-800 dark:text-amber-300 text-sm'>
                            Message delivery in progress: {countdown} remaining
                        </p>
                    </div>
                )}

                {isMessageScheduled ? (
                    <div className='space-y-2'>
                        <Button
                            type='button'
                            className='w-full'
                            disabled={true}
                        >
                            Message Scheduled
                        </Button>

                        {!hasPendingMessages ? (
                            <Button
                                type='button'
                                className='w-full'
                                variant='ghost'
                                onClick={handleReset}
                            >
                                Schedule Another Message
                            </Button>
                        ) : (
                            <Button
                                type='button'
                                className='w-full'
                                variant='outline'
                                disabled
                            >
                                Waiting for message delivery...
                            </Button>
                        )}
                    </div>
                ) : (
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={
                            isSubmitting || !isFormValid || hasPendingMessages
                        }
                    >
                        {isSubmitting
                            ? 'Scheduling...'
                            : hasPendingMessages
                              ? 'Waiting for delivery...'
                              : 'Send Message'}
                    </Button>
                )}

                {activeScheduledMessages.length > 0 && (
                    <div className='mt-8'>
                        <div className='flex justify-between items-center mb-2 mt-10'>
                            <h4 className='text-sm font-medium'>
                                Message History
                            </h4>
                            {activeScheduledMessages.some(
                                (msg) => msg.deliveredAt
                            ) && (
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={clearMessageHistory}
                                    className='h-6 text-xs'
                                >
                                    Clear History
                                </Button>
                            )}
                        </div>
                        <div className='space-y-1 text-xs'>
                            {activeScheduledMessages
                                .slice()
                                .reverse()
                                .map((msg, idx) => (
                                    <div
                                        key={msg.id}
                                        className={`p-2 rounded ${
                                            msg.deliveredAt
                                                ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900'
                                                : 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900'
                                        }`}
                                    >
                                        <div className='flex justify-between'>
                                            <span className='font-medium'>
                                                Message{' '}
                                                {activeScheduledMessages.length -
                                                    idx}
                                            </span>
                                            <span
                                                className={
                                                    msg.deliveredAt
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-amber-600 dark:text-amber-400'
                                                }
                                            >
                                                {msg.deliveredAt
                                                    ? `Delivered at ${msg.deliveredAt.toLocaleTimeString()}`
                                                    : `Scheduled for ${msg.scheduledAt.toLocaleTimeString()}`}
                                            </span>
                                        </div>
                                        <div className='mt-1 text-gray-600 dark:text-gray-400 line-clamp-1'>
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default SendSlackMessageForm
