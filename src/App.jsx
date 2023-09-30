import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import SuccessNotification from './components/SuccessNotification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSucessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs ))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)}, 5000)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title: title,
        author: author,
        url: url
      }

      await blogService.createNewBlog(newBlog)
      await blogService.getAll().then(blogs => setBlogs( blogs ))

      setTitle('')
      setAuthor('')
      setURL('')

      setSucessMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setSucessMessage(null)}, 5000)
    } catch (exception) {
      setErrorMessage('New blog could not be created')
      setTimeout(() => {
        setErrorMessaeg(null)}, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage}/>
        <form onSubmit = {handleLogin}>
          <div>
            username <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)}/>
          </div>
          <div>
            password <input type="text" value={password} name="Passowrd" onChange={({target}) => setPassword(target.value)}/>
          </div>
          <button type = "Submit">login</button>
        </form>
      </div>
    )
  }
  
  return (
    <div>
      <h2>blogs</h2>
      <SuccessNotification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>
      <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>
      <form onSubmit = {handleCreateNewBlog}>
        <div>title: <input type="text" value={title} name="Title" onChange={({target}) => setTitle(target.value)} /></div>
        <div>author: <input type="text" value={author} name="Author" onChange={({target}) => setAuthor(target.value)}/></div>
        <div>url: <input type="text" value={url} name="URL" onChange={({target}) => setURL(target.value)}/></div>
        <button type="Submit">create</button>
      </form>

      <br></br>
      <br></br>
      {blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}

    </div>
  )
}

export default App