export const Form = ({ 
  children, 
  onSubmit, 
  className = "" 
}: { 
  children: React.ReactNode; 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}) => {
  return (
    <form 
      onSubmit={onSubmit}
      className={`px-10 items-center h-full flex flex-col justify-around max-[60rem]:justify-start max-[60rem]:mt-8 ${className}`}
    >
      <style>{`
        input {
          text-align: center;
          padding: 1rem 0;
          font-family: 'Work Sans', sans-serif;
        }
        input::placeholder {
          color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
      {children}
    </form>
  );
};