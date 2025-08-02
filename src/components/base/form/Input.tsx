interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`text-base border border-gray-300 rounded-lg w-80 h-12 text-center font-work-sans max-[60rem]:text-2xl max-[60rem]:w-full ${className}`}
      {...props}
    />
  );
};