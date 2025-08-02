import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../elements/LogoutBtn";
import useAuth from "../context/useAuth";

const theme = {
  fondo: '#F9F9F9',
  colorPrimario: '#5B69E2',
  colorSecundario: '#000',
  verde: '#43A854',
  rojo: '#E34747',
  grisClaro: '#E8EFF1',
  grisClaro2: '#CBDDE2',
  azulClaro: '#8792F1',
  grisBackground: '#e8eff166'
};

interface SidebarProps {
  isMobile: boolean;
  showSidebar: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  showSidebar,
  toggleSidebar,
}) => {
  const location = useLocation();
  const { user } = useAuth();

  const sidebarClass = isMobile
    ? `fixed top-0 left-0 h-full bg-white z-40 shadow-2xl transform transition-all duration-300 ease-out w-full mt-12 ${
        showSidebar ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`
    : "w-72 bg-white border-r-0 shadow-xl hidden lg:block relative overflow-hidden h-screen";

  const menuItems = [
    { 
      to: "/", 
      label: "Add Expense", 
      description: "Track new expenses"
    },
    { 
      to: "/categories", 
      label: "Categories", 
      description: "Manage categories"
    },
    ...(isMobile ? [{ 
      to: "/list", 
      label: "Expenses", 
      description: "View all expenses"
    }] : []),
    { 
      to: "/money-box", 
      label: "Piggy Bank", 
      description: "Your savings"
    },
    { 
      to: "/budget-list", 
      label: "Budget", 
      description: "Budget planning"
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-30 transition-opacity duration-300"
          style={{ backgroundColor: `${theme.colorSecundario}50` }}
          onClick={toggleSidebar}
        />
      )}
      
      <div className={sidebarClass}>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-20 translate-y-20" />
        </div>

        <div className="relative z-10 p-8 h-full flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-3 mt-8">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={toggleSidebar}
                className={`group relative flex items-center p-4 rounded-xl transition-all duration-200 hover:scale-105 transform ${
                  isActive(item.to)
                    ? "shadow-lg border"
                    : "hover:shadow-md"
                }`}
                style={{
                  backgroundColor: isActive(item.to) ? `${theme.colorPrimario}20` : 'transparent',
                  borderColor: isActive(item.to) ? `${theme.colorPrimario}50` : 'transparent',
                  color: isActive(item.to) ? theme.colorSecundario : theme.colorSecundario + '80'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.backgroundColor = theme.grisClaro + '80';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Active indicator */}
                {isActive(item.to) && (
                  <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full" 
                    style={{ background: `linear-gradient(to bottom, ${theme.colorPrimario}, ${theme.azulClaro})` }}
                  />
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-sm opacity-70 mt-1">
                    {item.description}
                  </div>
                </div>

                {/* Hover arrow */}
                <div className={`transform transition-all duration-200 ${
                  isActive(item.to) ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="mb-8 pt-8" style={{ borderTop: `1px solid ${theme.grisClaro2}80` }}>
            <div 
              className="backdrop-blur-sm rounded-xl p-4 border"
              style={{ 
                backgroundColor: `${theme.grisBackground}`,
                borderColor: `${theme.grisClaro2}60`
              }}
            >
              <div className={`${isMobile ? 'flex' : 'grid'} items-center mb-4`}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.colorPrimario}, ${theme.azulClaro})` }}
                >
                  { user?.email?.charAt(0).toUpperCase() }
                </div>
                <div className="ml-3 lg:ml-0 lg:mt-2">
                  <div className="font-semibold" style={{ color: theme.colorSecundario }}>User</div>
                  <div className="text-sm" style={{ color: theme.colorSecundario + '70' }}>{user?.email}</div>
                </div>
              </div>
              
              {/* Logout button container */}
              <div className="transform hover:scale-105 transition-transform duration-200">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};