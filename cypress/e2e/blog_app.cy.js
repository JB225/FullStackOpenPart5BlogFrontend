describe('Blog app', () => {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'Test Username',
      password: '1111'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173/')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('suceeds with correct credentials', function() {
      cy.get('#username').type('Test Username')
      cy.get('#password').type('1111')
      cy.get('#login-button').click()

      cy.contains('Test User is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Wrong Username')
      cy.get('#password').type('Wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Test Username', password: '1111' })
    })

    it('A blog can be created', function() {
      cy.contains('Create New Blog').click()

      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test URL')

      cy.get('#create-button').click()

      cy.get('.success').should('contain', 'a new blog Test Title by Test Author added')
      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('.success').should('have.css', 'border-style', 'solid')
      cy.contains('Test Title, Test Author')
    })

    it('Users can like a blog', function() {
      cy.createBlog({ title: 'Test Title', author: 'Test Author', url: 'Test URL' })
      cy.contains('view').click()

      cy.contains('like').click()
      cy.contains('likes 1')

      cy.contains('like').click()
      cy.contains('likes 2')
    })

    it('Users can delete a blog they have created', function() {
      cy.createBlog({ title: 'Test Title', author: 'Test Author', url: 'Test URL' })
      cy.contains('view').click()
      cy.get('html').should('contain', 'Test Title, Test Author')
      cy.contains('delete').click()
      cy.get('html').should('not.contain', 'Test Title, Test Author')
    })

    it('Only the creator of a blog can see the delete button for that blog', function() {
      cy.createBlog({ title: 'Test Title', author: 'Test Author', url: 'Test URL' })
      cy.contains('logout').click()
      const user2 = {
        name: 'Test User2',
        username: 'Test Username2',
        password: '1111'
      }
      cy.request('POST', 'http://localhost:3003/api/users', user2)
      cy.login({ username: 'Test Username2', password: '1111' })
      cy.createBlog({ title: 'Test Title2', author: 'Test Author2', url: 'Test URL2' })

      cy.contains('view').click()
      cy.contains('view').click()

      cy.get('.delete').eq(0).should('not.visible')
      cy.get('.delete').eq(1).should('be.visible')
    })

    it('Blogs are ordered according to likes', function() {
      cy.createBlogWithLikes({ title: 'Test Title', author: 'Test Author', url: 'Test URL', likes: 20 })
      cy.createBlogWithLikes({ title: 'Test Title1', author: 'Test Author1', url: 'Test URL1', likes: 2 })
      cy.createBlogWithLikes({ title: 'Test Title2', author: 'Test Author2', url: 'Test URL2', likes: 50 })
      cy.createBlog({ title: 'Test Title3', author: 'Test Author3', url: 'Test URL3' })

      cy.get('.blog').eq(0).should('contain', 'Test Title3, Test Author3')
      cy.get('.blog').eq(1).should('contain', 'Test Title1, Test Author1')
      cy.get('.blog').eq(2).should('contain', 'Test Title, Test Author')
      cy.get('.blog').eq(3).should('contain', 'Test Title2, Test Author2')

      cy.contains('view').click()

      cy.contains('like').click()
      cy.wait(200)
      cy.contains('like').click()
      cy.wait(200)

      cy.get('.blog').eq(0).should('contain', 'Test Title1, Test Author1')
      cy.get('.blog').eq(1).should('contain', 'Test Title3, Test Author3')
    })
  })
})