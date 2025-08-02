import { Outlet } from "react-router-dom";
import { useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { Sidebar } from "./Sidebar";
import BalanceBar from "./BalanceBar";
import theme from "../theme";

const PrivateLayout = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      {isMobile && (
        <>
          <header className="flex items-center justify-between px-4 py-4 bg-white border-b shadow-sm lg:hidden w-full fixed top-0 z-50">
            {!showSidebar ? (
              <button onClick={toggleSidebar} className="text-gray-800 text-xl">
                ☰
              </button>
            ) : (
              <button
                className="transition-colors duration-200 p-2 rounded-lg hover:opacity-70"
                style={{
                  color: theme.colorSecundario
                }}
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-semibold">Expenses App</h1>
          </header>
        </>
      )}

      <Sidebar
        isMobile={isMobile}
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col mt-14 lg:mt-0`}
        style={{ background: theme.grisBackground }}
      >
        <div className={`mt-${isMobile ? "16" : "0"} flex-1`}>
          <div className="flex" style={{ background: theme.grisClaro }}>
            <BalanceBar />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;
