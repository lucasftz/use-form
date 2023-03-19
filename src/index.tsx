import { SyntheticEvent, useState } from 'react'

interface Props<T> {
  schema: { [Key in keyof T]: (value: T[Key]) => boolean }
}

function handleInput<T>(inputElement: HTMLInputElement, formData: T) {
  switch (inputElement.type) {
    case 'radio':
      if (inputElement.checked) {
        formData[inputElement.name as keyof T] =
          inputElement.value as unknown as T[keyof T]
      }
      break
    case 'file':
      formData[inputElement.name as keyof T] = Array.from(
        inputElement.files ?? []
      ) as unknown as T[keyof T]
      break
    case 'checkbox':
      if (inputElement.checked) {
        // @ts-ignore
        formData[inputEl.name as keyof T] = formData.hasOwnProperty(
          inputElement.name
        )
          ? [
              ...(formData[
                inputElement.name as keyof T
              ] as unknown as string[]),
              inputElement.value
            ]
          : [inputElement.value]
      }
      break
    default:
      formData[inputElement.name as keyof T] =
        inputElement.value as unknown as T[keyof T]
      break
  }
}

function addFormData<T>(formElement: Element, formData: T) {
  // @ts-ignore
  if (formElement.disabled) return

  switch (formElement.tagName.toLowerCase()) {
    case 'input':
      const inputEl = formElement as HTMLInputElement

      handleInput(inputEl, formData)
      break
    case 'select':
      const selectEl = formElement as HTMLSelectElement

      formData[selectEl.name as keyof T] = Array.from(
        selectEl.selectedOptions
      ).map((option) => option.value) as unknown as T[keyof T]
      break
    case 'textarea':
      const textAreaEl = formElement as HTMLTextAreaElement

      formData[textAreaEl.name as keyof T] =
        textAreaEl.value as unknown as T[keyof T]
      break
    case 'output':
      const outputEl = formElement as HTMLOutputElement

      formData[outputEl.name as keyof T] =
        outputEl.value as unknown as T[keyof T]
      break
    case 'fieldset':
      const fieldSetEl = formElement as HTMLFieldSetElement

      for (const fieldSetChild of Array.from(fieldSetEl.children)) {
        addFormData(fieldSetChild, formData)
      }
      break
    default:
      break
  }
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
      const errorsObject = {} as { [Key in keyof TFormData]: boolean }

      const formElements = Array.from(e.currentTarget.elements).filter((el) =>
        new Set(['input', 'select', 'textarea', 'output', 'fieldset']).has(
          el.tagName.toLowerCase()
        )
      )

      for (const formElement of formElements) {
        // @ts-ignore
        if (!formElement.name) continue
        addFormData(formElement, formData)

        // @ts-ignore
        const isError = schema.hasOwnProperty(formElement.name)
          ? // @ts-ignore
            !schema[formElement.name](formData[formElement.name])
          : false

        // @ts-ignore
        errorsObject[formElement.name] = isError
      }

      setErrors(errorsObject)

      if (Object.values(errorsObject).every((isError) => isError === false)) {
        handleSubmit({ e, formData })
      }
    }
  }

  return { formHandler, errors }
}
