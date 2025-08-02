export const FormContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {children}
    </div>
  );
};