import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password })
      authContext?.login(response.data)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form data-testid="login_form" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            data-testid="login_form_username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            data-testid="login_form_password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" data-testid="login_form_login">Login</button>
      </form>
    </div>
  )
}

export default Login
