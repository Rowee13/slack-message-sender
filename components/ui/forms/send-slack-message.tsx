'use client'

import { useEffect, useState } from 'react'

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

const SendSlackMessageForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isMessageScheduled, setIsMessageScheduled] = useState(false)

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

    const handleReset = () => {
        setIsMessageScheduled(false)
        reset({
            delayInput: 5,
            delayUnit: 'seconds',
            messageInput: '',
            hookUrlInput: '',
        })
    }

    async function onSubmit(values: z.infer<typeof slackMessageFormSchema>) {
        setIsSubmitting(true)
        setIsMessageScheduled(false)

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
                toast.success(
                    `Message scheduled! It will be sent at ${new Date(data.scheduledTime).toLocaleTimeString()}`
                )
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

                {isMessageScheduled ? (
                    <div className='space-y-2'>
                        <Button
                            type='button'
                            className='w-full'
                            disabled={true}
                        >
                            Message Scheduled
                        </Button>
                        <Button
                            type='button'
                            className='w-full'
                            variant='ghost'
                            onClick={handleReset}
                        >
                            Schedule Another Message
                        </Button>
                    </div>
                ) : (
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isSubmitting || !isFormValid}
                    >
                        {isSubmitting ? 'Scheduling...' : 'Send Message'}
                    </Button>
                )}
            </form>
        </Form>
    )
}

export default SendSlackMessageForm
