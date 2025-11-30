const Button = ({ 
  children, 
  type = 'button', 
  disabled = false, 
  className = '', 
  onClick,
  variant = 'primary',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900'
  
  const variants = {
    primary: `bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 ${
      disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:scale-105'
    }`,
    secondary: `bg-slate-700/50 border border-slate-600 text-gray-300 hover:bg-slate-600/50 hover:border-cyan-400/50 hover:text-cyan-300 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
    }`,
    ghost: `text-gray-400 hover:text-cyan-400 hover:bg-slate-700/30 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button