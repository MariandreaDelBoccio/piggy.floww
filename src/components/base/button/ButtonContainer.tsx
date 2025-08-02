export const ButtonContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`flex justify-center my-10 ${className}`}>
      {children}
    </div>
  );
};