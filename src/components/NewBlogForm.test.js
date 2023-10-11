import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('<NewBlogForm /> parent state and calls onSubmit', async () => {
  const handleCreateNewBlog = jest.fn()
  const user = userEvent.setup()

  render(<NewBlogForm createNewBlog={handleCreateNewBlog} />)

  let input = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  const testTitle = 'test title'
  const testAuthor = 'test author'
  const testURL = 'test URL'

  await user.type(input[0], testTitle)
  await user.type(input[1], testAuthor)
  await user.type(input[2], testURL)
  await user.click(sendButton)

  expect(handleCreateNewBlog.mock.calls).toHaveLength(1)
  expect(handleCreateNewBlog.mock.calls[0][0].title).toBe(testTitle)
  expect(handleCreateNewBlog.mock.calls[0][0].author).toBe(testAuthor)
  expect(handleCreateNewBlog.mock.calls[0][0].url).toBe(testURL)
})