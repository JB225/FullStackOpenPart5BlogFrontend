import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
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

  const blogFormRef = useRef()

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

      // TODO: ToggleVisiblity when use brackets it returns undefined object
      // but when run withotu them it doesn't run - look at fixing this for 5.5
      blogFormRef.current.toggleVisbility
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
        setErrorMessage(null)}, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <LoginForm 
          handleLogin={handleLogin} 
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword}
          errorMessage={errorMessage}/>
      </div>
    )
  }
  
  return (
    <div>
      <h2>blogs</h2>
      <SuccessNotification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>
      <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
        <NewBlogForm 
          handleCreateNewBlog={handleCreateNewBlog} 
          title={title} 
          setTitle={setTitle} 
          author={author}
          setAuthor={setAuthor}
          url={url}
          setURL={setURL} />
        </Togglable>

      <br></br>
      {blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}

    </div>
  )
}

export default App