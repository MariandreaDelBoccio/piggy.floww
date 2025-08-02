import type { ReactNode } from "react";

export interface BaseButtonProps {
  onClick: (v: unknown) => void;
  classes?: string;
  hasIcon?: boolean;
  children?: ReactNode;
  text?: string;
}

const BaseButton = ({ classes, onClick, hasIcon = false, children, text }: BaseButtonProps) => {
  const propsClasses = classes ?? "bg-black hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center";

  return (
    <button className={propsClasses} onClick={onClick}>
      {hasIcon && children && <span className="mr-2">{children}</span>}
      {text && <span>{text}</span>}
    </button>
  );
};

export default BaseButton;
