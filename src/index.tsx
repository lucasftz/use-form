import { SyntheticEvent, useState } from 'react'

interface Props<T> {
  schema: { [Key in keyof T]: (value: T[Key]) => boolean }
}

export function useForm<TFormData>({ schema }: Props<TFormData>) {
  const [errors, setErrors] = useState({
    ...Object.fromEntries(
      Object.keys(schema).map((key) => [key as keyof TFormData, false])
    )
  } as { [Key in keyof TFormData]: boolean })

  function formHandler(
    handleSubmit: ({
      e,
      formData
    }: {
      e: SyntheticEvent<HTMLFormElement>
      formData: TFormData
    }) => void
  ) {
    return (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = {} as TFormData
      const formElements = Array.from(e.currentTarget.elements) as unknown as {
        name: keyof TFormData
        value: TFormData[keyof TFormData]
      }[]

      const errorsObject = {} as { [Key in keyof TFormData]: boolean }

      for (const formElement of formElements) {
        if (formElement.name) {
          formData[formElement.name] = formElement.value

          const isError = schema.hasOwnProperty(formElement.name)
            ? !schema[formElement.name](formElement.value)
            : false

          errorsObject[formElement.name] = isError
        }
      }

      setErrors(errorsObject)

      if (Object.values(errorsObject).every((value) => value === false)) {
        handleSubmit({ e, formData })
      }
    }
  }

  return { formHandler, errors }
}
