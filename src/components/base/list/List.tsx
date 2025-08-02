export const List = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`p-0 ${className}`}>
      {children}
    </div>
  );
};