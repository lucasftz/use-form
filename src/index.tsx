import { SyntheticEvent, useState } from 'react'

interface Props<T> {
  schema: { [Key in keyof T]: (value: T[Key]) => boolean }
}

function as<T extends Element>(element: Element) {
  return element as T
}

function addFormData<T>(formElement: Element, formData: T) {
  // @ts-ignore
  if (formElement.disabled) return

  switch (formElement.tagName.toLowerCase()) {
    case 'input':
      const inputEl = as<HTMLInputElement>(formElement)

      if (inputEl.type === 'radio') {
        if (inputEl.checked) {
          formData[inputEl.name as keyof T] =
            inputEl.value as unknown as T[keyof T]
        }
      } else if (inputEl.type === 'checkbox') {
        if (inputEl.checked) {
          // @ts-ignore
          formData[inputEl.name as keyof T] = formData.hasOwnProperty(
            inputEl.name
          )
            ? [
                ...(formData[inputEl.name as keyof T] as unknown as string[]),
                inputEl.value
              ]
            : [inputEl.value]
        }
      } else {
        formData[inputEl.name as keyof T] =
          inputEl.value as unknown as T[keyof T]
      }
      break
    case 'select':
      const selectEl = as<HTMLSelectElement>(formElement)

      formData[selectEl.name as keyof T] = Array.from(
        selectEl.selectedOptions
      ).map((option) => option.value) as unknown as T[keyof T]
      break
    case 'textarea':
      const textAreaEl = as<HTMLTextAreaElement>(formElement)

      formData[textAreaEl.name as keyof T] =
        textAreaEl.value as unknown as T[keyof T]
      break
    case 'output':
      const outputEl = as<HTMLOutputElement>(formElement)

      formData[outputEl.name as keyof T] =
        outputEl.value as unknown as T[keyof T]
      break
    case 'fieldset':
      const fieldSetEl = as<HTMLFieldSetElement>(formElement)

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
