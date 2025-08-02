export const ContainerSubtitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {children}
    </div>
  );
};