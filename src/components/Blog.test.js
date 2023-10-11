import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let blog
  let mockUpdatedBlogHandler

  beforeEach(() => {
    blog = {
      id: 'blog test id',
      title: 'Test Blog Title',
      author: 'Testy McTestface',
      url: 'www.testurl.com',
      likes: 0,
      user: {
        id: 'testid' }
    }

    window.confirm = jest.fn()
    mockUpdatedBlogHandler = jest.fn()
    const mockDeletedBlogHandler = jest.fn()

    container = render(<Blog key={blog.id}
      blog={blog}
      username={'test username'}
      handleUpdatedBlog={mockUpdatedBlogHandler}
      handleDeletedBlog={mockDeletedBlogHandler} />).container
  })

  test('renders blog title and author only', () => {
    const elementTitleAuthor = screen.getByText(blog.title + ', ' + blog.author)
    const div = container.querySelector('.shownOnlyWhenShowTrue')

    expect(elementTitleAuthor).toBeDefined()
    expect(div).toHaveStyle('display: none')
  })

  test('blog url and likes shown when button clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const elementURL = screen.getByText(blog.url)
    const elementLikes = screen.getByText('likes ' + blog.likes)
    const div = container.querySelector('.shownOnlyWhenShowTrue')

    expect(div).not.toHaveStyle('display: none')
    expect(elementURL).toBeDefined
    expect(elementLikes).toBeDefined
  })

  test('like handler is called twice when like button clicked twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')

    await user.click(button)
    expect(mockUpdatedBlogHandler.mock.calls).toHaveLength(1)
    await user.click(button)
    expect(mockUpdatedBlogHandler.mock.calls).toHaveLength(2)
  })
})