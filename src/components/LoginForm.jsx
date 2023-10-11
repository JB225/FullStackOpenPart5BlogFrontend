import ErrorNotification from './ErrorNotification'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword, errorMessage }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <ErrorNotification message={errorMessage}/>
      <form onSubmit = {handleLogin}>
        <div>
            username <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
            password <input type="text" value={password} name="Passowrd" onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type = "Submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm