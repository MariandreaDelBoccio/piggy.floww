export const Category = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mr-4 ${className}`}>
      {children}
    </div>
  );
};