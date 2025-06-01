import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { saveUserToFirestore } from '../services/userService'
import '../styles/SignUp.css'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    try {
      setLoading(true)
      // Create user with email and password
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = result.user      // Update the user's display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      })

      // Reload user to get updated profile
      await user.reload()

      // Save user data to Firestore
      await saveUserToFirestore(user)

      console.log('Sign up successful:', user)
      navigate('/home')
    } catch (error) {
      console.error('Sign up error:', error)
      // You might want to show an error message to the user here
    } finally {
      setLoading(false)
    }
  }

  // Password validation
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password)
  }

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ''

  const isFormValid = 
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    Object.values(passwordRequirements).every(req => req) &&
    passwordsMatch &&
    agreeToTerms

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join us and start your journey</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input password-input"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L15.12 15.12" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {formData.password && (
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li>
                    <span className={passwordRequirements.length ? 'check' : 'cross'}>
                      {passwordRequirements.length ? '✓' : '✗'}
                    </span>
                    At least 8 characters
                  </li>
                  <li>
                    <span className={passwordRequirements.uppercase ? 'check' : 'cross'}>
                      {passwordRequirements.uppercase ? '✓' : '✗'}
                    </span>
                    One uppercase letter
                  </li>
                  <li>
                    <span className={passwordRequirements.lowercase ? 'check' : 'cross'}>
                      {passwordRequirements.lowercase ? '✓' : '✗'}
                    </span>
                    One lowercase letter
                  </li>
                  <li>
                    <span className={passwordRequirements.number ? 'check' : 'cross'}>
                      {passwordRequirements.number ? '✓' : '✗'}
                    </span>
                    One number
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="password-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="form-input password-input"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L15.12 15.12" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <div className="password-requirements">
                <p style={{ color: '#ef4444' }}>Passwords do not match</p>
              </div>
            )}
            {passwordsMatch && formData.confirmPassword && (
              <div className="password-requirements">
                <p style={{ color: '#10b981' }}>✓ Passwords match</p>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="checkbox-input"
              required
            />
            <label htmlFor="terms" className="checkbox-label">
              I agree to the{' '}
              <a href="#" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid || loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">Or</span>
        </div>

        {/* Login Link */}
        <div className="login-link">
          <p>
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp