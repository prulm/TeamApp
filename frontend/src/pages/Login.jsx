import React, { useState, useEffect } from 'react'
import '../styles/loginbox.scss'
import { Link, useNavigate, redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login, checkAuthenticated } from '../actions/auth'
import { Helmet } from 'react-helmet'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function Login({ login, isAuthenticated, isLoading, error }) {
  const [formData, setFormData] = useState({user: "", password: ""})
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      return navigate('/home')
    }
  }, [isAuthenticated])
  
  function handleChange(event) {
    const {name, value} = event.target
    setFormData(prevFormData => ({...prevFormData, [name]: value}))
  }
  function handleToggle(event) {
    const {checked} = event.target
    setShowPass(checked)
  }
  function handleSubmit(event) {
    event.preventDefault()
    login(formData.user, formData.password)
  }
  
  return (
    <>
      <Helmet>
        <title>Sign in</title>
        <meta name="description" content="Teamtrek Team collab and task management suite"  />
      </Helmet>
      <div className="login-container">
        <div className="box">
          <h1>Sign in</h1>
          <form className="inputs" onSubmit={handleSubmit}>
            <div className="revlabel">
              <input 
                type="email" 
                required 
                id="user" 
                value={formData.user} 
                name="user" 
                placeholder="Email address" 
                onFocus={e => {e.target.placeholder=""}} 
                onBlur={e => {e.target.placeholder="Email address"}} 
                onChange={handleChange} 
              />
              <label htmlFor="user">Email</label>
            </div>
            <div className="revlabel">
              <input 
                type={showPass ? "text" : "password"} 
                required id="password" 
                value={formData.password} 
                name="password" 
                placeholder="Password" 
                onFocus={e => {e.target.placeholder=""}} 
                onBlur={e => {e.target.placeholder="Password"}} 
                onChange={handleChange} 
              /> 
              <label htmlFor="password">Password</label>
            </div>
            <div className='passtgl'>
              <input
                type="checkbox" 
                id="showPass" 
                name="showPass" 
                checked={showPass} 
                onChange={handleToggle}
              />
              <label htmlFor="showPass"> Show Password</label>
            </div>
            <button className='login-button'>Sign in</button>
          </form>
          {isLoading ? <AiOutlineLoading3Quarters className='loading' /> : error ? <p className='error-msg'>{error}</p> : <></>}
          <div className="btmcont">
            <div className='link-cont'>{`Don't have an account? `}<Link className="link" to="/register">Register here</Link></div>
            <div className='link-cont'>Forgot password? <Link className="link" to="/reset-password">Reset password</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.trek.isAuthenticated,
  isLoading: state.trek.isLoading,
  error: state.trek.error
})
export default connect(mapStateToProps, { login })(Login)