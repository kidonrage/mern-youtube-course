import React, { useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = React.useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      message(data.message)
    } catch (e) {

    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch (e) {

    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Trim a link</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>
            <div>

            <div className="input-field">
              <input 
                placeholder="Enter an e-mail" 
                id="email" 
                type="email"
                name="email"
                className="yellow-input"
                onChange={changeHandler}
                value={form.email}
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-field">
              <input 
                placeholder="Enter your password" 
                id="password" 
                type="password"
                name="password"
                className="yellow-input"
                onChange={changeHandler}
                value={form.password}
              />
              <label htmlFor="password">Password</label>
            </div>

            </div>
          </div>
          <div className="card-action">
            <button 
              className="btn yellow darken-4" 
              style={{marginRight: 10}}
              disabled={loading}
              onClick={loginHandler}
            >
              Log In
            </button>
            <button 
              className="btn grey whiten-1 black-text"
              onClick={registerHandler}
              disabled={loading}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}