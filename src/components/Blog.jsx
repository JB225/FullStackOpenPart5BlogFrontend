import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, username, handleUpdatedBlog, handleDeletedBlog }) => {
  const [blogShown, setBlogShown] = useState(false)
  const ShowWhenBlogShown = { display: blogShown ? '' : 'none'}
  const showDeleteButton = { display: username === blog.user.username ? '' : 'none'}

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleShowFullBlog = () => {
    setBlogShown(!blogShown)
  }

  const handleLikeBlog = async () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const updatedBlogResponse = await blogService.updateBlog(blog.id, updatedBlog)
    handleUpdatedBlog(updatedBlogResponse)
  }

  const handleDeleteBlog = async() => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.deleteBlog(blog.id)
      handleDeletedBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}, {blog.author} <button onClick={toggleShowFullBlog}>{blogShown ? 'hide' : 'view'}</button>
      </div>
      <div style={ShowWhenBlogShown}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLikeBlog}>like</button></div>
        <div>{blog.user.name}</div>
        <div><button onClick={handleDeleteBlog} style={showDeleteButton}>delete</button></div>
      </div>
    </div>
)}

export default Blog