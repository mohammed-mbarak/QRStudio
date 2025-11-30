const InputField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  min,
  max,
  className = '',
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={name} 
          className="flex items-center text-sm font-medium text-gray-300 mb-2"
        >
          {label} 
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
          {...props}
        />

        {required && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputField
