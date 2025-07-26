import Button from "../elements/Button";
import CatIcon from "../assets/images/cat_icon.svg?react";
import ListIcon from "../assets/images/list_icon.svg?react";
import PiggyBank from "../assets/images/piggy_bank.svg?react";
import Money from "../assets/images/money.svg?react";
import LogoutButton from "../elements/LogoutBtn";

export const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:justify-center">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          {/* Botón cerrar solo en móvil */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Button
                to="/categories"
                className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeSidebar}
              >
                <CatIcon className="w-5 h-5 mr-3" />
                <span>Categories</span>
              </Button>
            </li>
            <li>
              <Button
                to="/list"
                className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeSidebar}
              >
                <ListIcon className="w-5 h-5 mr-3" />
                <span>Expenses</span>
              </Button>
            </li>
            <li>
              <Button
                to="/money-box"
                className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeSidebar}
              >
                <PiggyBank className="w-5 h-5 mr-3" />
                <span>Piggy</span>
              </Button>
            </li>
            <li>
              <Button
                to="/budget-list"
                className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeSidebar}
              >
                <Money className="w-5 h-5 mr-3" />
                <span>Budget</span>
              </Button>
            </li>
          </ul>
          
          {/* Logout button */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <LogoutButton className="w-full" />
          </div>
        </nav>
      </div>
    </>
  );
};

// Componente del Header con hamburger
export const MobileHeader = ({ toggleSidebar }) => {
  return (
    <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Add expenses</h1>
        <div className="w-10"></div> {/* Spacer para centrar el título */}
      </div>
    </div>
  );
};