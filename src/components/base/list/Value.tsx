export const Value = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`text-xl font-bold text-gray-900 mr-4 flex items-center ${className}`}>
      {children}
    </div>
  );
};