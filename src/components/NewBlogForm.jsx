import { useState } from 'react'

const NewBlogForm = ({ createNewBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    createNewBlog(newBlog)

    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit = {handleCreateNewBlog}>
        <div>title: <input
          id='title'
          type="text" value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)} /></div>

        <div>author: <input
          id='author'
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}/></div>

        <div>url: <input
          id='url'
          type="text"
          value={url}
          name="URL"
          onChange={({ target }) => setURL(target.value)}/></div>
        <button id='create-button' type="Submit">create</button>
      </form>
    </div>
  )
}

export default NewBlogForm