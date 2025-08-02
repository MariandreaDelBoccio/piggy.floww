interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  to?: string;
  className?: string;
}

export const ActionButton = ({ 
  children, 
  as: Component = 'button',
  className = "",
  ...props 
}: ActionButtonProps) => {
  const baseClasses = "p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  
  return (
    <Component 
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};