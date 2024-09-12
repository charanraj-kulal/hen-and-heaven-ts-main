"use client";
import { useState, useEffect } from "react";

import { Bolt, Home, LogOut, User } from "lucide-react";
import ClickOutside from "../../components/ClickOutside";
import { useUser } from "../../hooks/UserContext";
import { Link, useNavigate } from "react-router-dom";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userData, logout } = useUser();
  const navigate = useNavigate();
  const [localUserData, setLocalUserData] = useState(userData);

  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  const getProfileImage = () => {
    if (localUserData?.profileUrl && localUserData.profileUrl !== "null") {
      return localUserData.profileUrl;
    }
    return null;
  };
  // const getProfileImage = () => {
  //   if (userData.profileUrl && userData.profileUrl !== "null") {
  //     return userData.profileUrl;
  //   }
  //   return null;
  // };

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login-register");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!localUserData) {
    return null; // Show nothing or a loading spinner if userData is null
  }

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          {localUserData ? (
            <>
              <span className="block text-sm font-medium text-black dark:text-white">
                {localUserData.fullName}
              </span>
              <span className="block text-xs">{localUserData.userRole}</span>
            </>
          ) : (
            // Fallback if userData is not available
            <span className="block text-sm font-medium text-gray-500">
              Guest
            </span>
          )}
        </span>

        {getProfileImage() ? (
          <span className="h-12 w-12 rounded-full">
            <img
              width={112}
              height={112}
              src={getProfileImage()}
              style={{ width: "auto", height: "auto" }}
              alt="User"
              className="rounded-full"
            />
          </span>
        ) : (
          <>
            <span className="h-12 w-12 rounded-full hidden dark:block">
              <img
                width={112}
                height={112}
                src="https://firebasestorage.googleapis.com/v0/b/hen-and-heaven.appspot.com/o/Untitled%20design%20(27).png?alt=media&token=c1711f65-7d02-4345-a98b-ccec5f95b3bf"
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
                className="rounded-full"
              />
            </span>
            <span className="h-12 w-12 rounded-full block dark:hidden">
              <img
                width={112}
                height={112}
                src="https://firebasestorage.googleapis.com/v0/b/hen-and-heaven.appspot.com/o/Untitled%20design%20(3).png?alt=media&token=02b1ae20-9723-4d3c-9099-65c0b8502b8d"
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
                className="rounded-full"
              />
            </span>
          </>
        )}

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <Home size={20} />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <User size={20} />
                My Profile
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <Bolt size={20} />
                Account Settings
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <LogOut size={20} className="ml-0.5" />
            Log Out
          </button>
        </div>
      )}

      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
