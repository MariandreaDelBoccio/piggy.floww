// components/MobileMenu.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // o tus propios íconos SVG
import "./MobileMenu.css"; // para estilos

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu-container">
      <button onClick={() => setIsOpen(!isOpen)} className="menu-toggle">
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div className="menu-dropdown">
          <Link to="/categories" onClick={() => setIsOpen(false)}>
            Categories
          </Link>
          <Link to="/list" onClick={() => setIsOpen(false)}>
            Expenses
          </Link>
          <Link to="/money-box" onClick={() => setIsOpen(false)}>
            Piggy Bank
          </Link>
          <Link to="/budget-list" onClick={() => setIsOpen(false)}>
            Budget
          </Link>
        </div>
      )}
    </div>
  );
}
