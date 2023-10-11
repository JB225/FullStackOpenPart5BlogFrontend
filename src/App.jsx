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

      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)}, 5000)
    }

    setPassword('')
    setUsername('')
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlogReturn = await blogService.createNewBlog(newBlog)
      setBlogs(blogs.concat(newBlogReturn))

      setSucessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSucessMessage(null)}, 5000)
    } catch (exception) {
      setErrorMessage('New blog could not be created')
      setTimeout(() => {
        setErrorMessage(null)}, 5000)
    }
  }

  const handleUpdatedBlog = async (blogId, updatedBlog) => {
    const updatedBlogResponse = await blogService.updateBlog(blogId, updatedBlog)
    const updatedBlogs = blogs.map(blog => blog.id === updatedBlogResponse.id ? updatedBlogResponse : blog)
    setBlogs(updatedBlogs)
  }

  const handleDeletedBlog = async(deletedBlogId) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== deletedBlogId)
    setBlogs(updatedBlogs)
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
        <NewBlogForm createNewBlog={handleCreateNewBlog} />
      </Togglable>

      <br></br>
      {blogs
        .map(blog => <Blog key={blog.id}
          blog={blog}
          username={user.username}
          handleUpdatedBlog={handleUpdatedBlog}
          handleDeletedBlog={handleDeletedBlog} />)
        .sort((a,b) => a.props.blog.likes - b.props.blog.likes)}
    </div>
  )
}

export default App