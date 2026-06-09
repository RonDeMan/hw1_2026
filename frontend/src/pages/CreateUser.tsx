import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CreateUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('http://localhost:3001/users', { name, email, username, password })
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user')
    }
  }

  return (
    <div>
      <h2>Create New User</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form data-testid="create_user_form" onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            data-testid="create_user_form_name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            data-testid="create_user_form_email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            data-testid="create_user_form_username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            data-testid="create_user_form_password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" data-testid="create_user_form_create_user">Create User</button>
      </form>
    </div>
  )
}

export default CreateUser
