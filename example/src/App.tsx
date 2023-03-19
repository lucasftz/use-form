import React from 'react'

import { useForm } from '@lucasftz/use-form'

function validateUsername(username: string) {
  const takenUsernames: (string | number)[] = ['John Doe', 'John Smith']

  return !takenUsernames.includes(username)
}

function validatePassword(password: string) {
  return password !== 'password'
}

interface FormData {
  username: string
  password: string
}

const App = () => {
  const { formHandler, errors } = useForm<FormData>({
    schema: {
      username: validateUsername,
      password: validatePassword
    }
  })

  const handleSubmit = formHandler(() => {})

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' name='username' placeholder='username' />
      {errors.username && <span>Invalid username</span>}
      <input type='password' name='password' placeholder='password' />
      {errors.password && <span>Invalid password</span>}
    </form>
  )
}

export default App
