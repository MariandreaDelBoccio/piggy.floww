export const ElementList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
};