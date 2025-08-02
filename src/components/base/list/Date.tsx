export const Date = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-blue-500 text-white text-sm font-semibold uppercase py-2 px-6 ${className}`}>
      {children}
    </div>
  );
};