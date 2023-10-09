import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createNewBlog = async newBlog => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const updateBlog = async (blogId, updatedBlog) => {
  const response = await axios.put(baseUrl + '/' + blogId, updatedBlog)
  return response.data
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: {Authorization: token}
  }

  await axios.delete(baseUrl + '/' + blogId, config)
}

export default { setToken, getAll, createNewBlog, updateBlog, deleteBlog }