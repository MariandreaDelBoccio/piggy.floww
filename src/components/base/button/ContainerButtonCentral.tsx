export const ContainerButtonCentral = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`flex justify-center py-6 ${className}`}>
      {children}
    </div>
  );
};