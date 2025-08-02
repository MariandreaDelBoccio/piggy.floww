export const Subtitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={`text-gray-600 text-lg mb-4 ${className}`}>
      {children}
    </p>
  );
};