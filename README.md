# use-simepleform

> A powerful form library for error handling and managing input values without the need for controlled components, allowing you to write more concise and readable code.

[![NPM](https://img.shields.io/npm/v/use-simepleform.svg)](https://www.npmjs.com/package/use-simepleform) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-simepleform
```

## Quickstart

```tsx
import React from 'react'

import { useForm } from 'use-simepleform'

interface FormData {
  username: string;
}

function Example() {
  const { formHandler, errors } = useForm<FormData>({
    schema: {
      username: (value) => value.length > 3,
    },
  });

  const handleSubmit = formHandler(({ e, formData }) => {});

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <button>Submit</button>
    </form>
  );
}
```

## API

Here, you can list and describe the available functions, classes, and options. For example:

```ts
interface ReturnType<T> {
  errors: { [Key in keyof TFormData]: boolean },
  formHandler: ({ e, formData }: { e: SyntheticEvent<HTMLFormElement>, formData: T }) => void
}

interface Props<T> {
  schema: { [Key in keyof T]: (value: T[Key]) => boolean }
}

function useForm<TFormData>({ schema }: Props<TFormData>): ReturnType<TFormData> {
  // ...
}
```
The useForm hook returns a function with an object with two properties as a parameter:

`formHandler` is a function that takes a callback function as its argument. This callback function will be called when the form is submitted and all validation checks are successful. The callback function receives an object with two properties: e, the form event, and formData, an object containing the form data.

`errors` is an object with the keys of FormData and a boolean value of if that key has errored. This is revalidated on every submit.

`schema` (required prop) is an object that defines the validation rules for the form fields. Each key corresponds to a field in the form, and the value is a validation function that receives the field value as its argument and returns a boolean indicating whether the value is valid.

## License

MIT © [lucasftz](https://github.com/lucasftz)
