import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      setUsername('')
      setPassword('')
      console.log(user)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)}, 5000)
      }
    }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit = {handleLogin}>
        <div>
          username <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)}/>
        </div>
        <div>
          password <input type="text" value={password} name="Passowrd" onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type = "Submit">login</button>
      </form>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App

// TODO: Add conditional rendering of login form