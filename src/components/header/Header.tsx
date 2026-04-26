import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CONFIG } from "../../utils/config/config";
import { URLS } from "../../utils/api-endpoints/endpoint";
import { getRequest } from "../../utils/core-api-functions/coreApiFunctions";
import type { UserData } from "../../utils/types/Type";


const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch user email from API using axios utility and correct typing
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getRequest<any>(`${CONFIG.API_BASE_URL}/${URLS.user.getUserDetails}`);
        if (data && data.userData && data.userData.email) {
          setUserEmail(data.userData.email);
        } else {
          // fallback to localStorage
          const userDataStr = localStorage.getItem("userData");
          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr);
              if (userData && userData.email) setUserEmail(userData.email);
              else setUserEmail("");
            } catch { setUserEmail(""); }
          } else setUserEmail("");
        }
      } catch {
        // fallback to localStorage
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            if (userData && userData.email) setUserEmail(userData.email);
            else setUserEmail("");
          } catch { setUserEmail(""); }
        } else setUserEmail("");
      }
    };
    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await fetch(`${CONFIG.API_BASE_URL}/${URLS.user.logoutUser}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {}
    // Clear local storage/session if needed
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className={styles.headerBar}>
      <div className={styles.spacer}></div>
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <FaUserCircle
          className={styles.userIcon}
          onClick={() => setDropdownOpen((v) => !v)}
          style={{ cursor: "pointer" }}
        />
        {dropdownOpen && (
          <div className={styles.userDropdown}>
            <div className={styles.userEmail}>{userEmail}</div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
