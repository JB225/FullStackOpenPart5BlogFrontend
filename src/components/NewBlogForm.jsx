const NewBlogForm = ({handleCreateNewBlog, title, setTitle, author, setAuthor, url, setURL}) => {
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit = {handleCreateNewBlog}>
                <div>title: <input type="text" value={title} name="Title" onChange={({target}) => setTitle(target.value)} /></div>
                <div>author: <input type="text" value={author} name="Author" onChange={({target}) => setAuthor(target.value)}/></div>
                <div>url: <input type="text" value={url} name="URL" onChange={({target}) => setURL(target.value)}/></div>
                <button type="Submit">create</button>
            </form>
        </div>
    )
}

export default NewBlogForm