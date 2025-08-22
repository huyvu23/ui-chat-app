import { FormProvider, UseFormReturn, useForm } from 'react-hook-form'
import { ReactNode } from 'react'

interface FormWrapperProps {
  children: ReactNode
  methods?: UseFormReturn<any>
  onSubmit: (e: any) => void
}

export default function FormWrapper(props: FormWrapperProps) {
  const { methods, onSubmit } = props
  const formMethod = useForm()
  const newMethods = methods || formMethod

  return (
    <FormProvider {...newMethods}>
      <form onSubmit={newMethods.handleSubmit(onSubmit)}>{props.children}</form>
    </FormProvider>
  )
}
