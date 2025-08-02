export const FilterContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`flex flex-col justify-between mb-8 items-start max-[60rem]:space-y-2.5 ${className}`}>
      {children}
    </div>
  );
};