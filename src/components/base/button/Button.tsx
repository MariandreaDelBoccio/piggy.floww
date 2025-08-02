interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: string;
  width?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button = ({ 
  children, 
  color = "#000", 
  width = "20rem",
  variant = 'primary',
  className = "",
  ...props 
}: ButtonProps) => {
  const baseClasses = "font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = variant === 'primary' 
    ? `${color ? color : 'bg-black'} text-white hover:bg-gray-800 focus:ring-black`
    : `${color ? color : 'bg-black'} text-black border border-gray-300 hover:bg-gray-50 focus:ring-gray-500`;

  const widthClass = width === "20rem" ? "w-80" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};