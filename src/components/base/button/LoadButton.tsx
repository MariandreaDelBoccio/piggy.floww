interface LoadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const LoadButton = ({ children, className = "", ...props }: LoadButtonProps) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};