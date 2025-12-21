import React, { useState, useEffect } from "react";
import styles from "./Index.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import type { SignInFormData } from "../../utils/types/Payload";
import type { ProfileResponse, SignInFormErrors } from "../../utils/types/Type";
import { URLS } from "../../utils/api-endpoints/endpoint";
import { CONFIG } from "../../utils/config/config";
import { getRequest } from "../../utils/core-api-functions/coreApiFunctions";
import Button from "../../components/button/Button";

import EmailInput from "../../components/emailInput/EmailInput";
import PasswordInput from "../../components/passwordInput/PasswordInput";


const BASE_URL = CONFIG.API_BASE_URL;

const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    
  });
  const [formErrors, setFormErrors] = useState<SignInFormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);
  const filterEmailInput = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9@.]/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const { name, type, value, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : name === "email"
        ? filterEmailInput(value) // sanitize email input here
        : value,
  }));
};

  const validateForm = (): boolean => {
    const errors: SignInFormErrors = {};
    if (!formData.email) {
      errors.email = "Valid Email is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { email, password } = formData;
      const response = await axios.post(`${BASE_URL}/${URLS.user.signInUser}`, {
        email,
        password,
      });

      console.log("Sign in API response:", response);

      // Adjusted condition to match backend's actual response
      if (response.data?.message === "Login successfully done") {
        const user = response.data.user;
        if (user?.role !== "admin") {
          toast.error("Access denied. Only admin users are allowed.");
          setLoading(false);
          return;
        }
        console.log("Sign in successful!", response.data);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userData", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message_key || "Login failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["signin-page"]}>
      <div className="ellipse-top-left"></div>
      <div className="ellipse-bottom-right"></div>

      <div className={styles["logo"]}>
        <div className={styles["logo-image"]}>LOGO</div>
      </div>

      <div className={styles["right-panel"]}>
        <form className={styles["signin-form"]} onSubmit={handleSubmit}>
          <h2 className={styles["welcome-title"]}>Welcome Back</h2>
          <p className={styles["welcome-subtext"]}>
            Please enter your details to sign in
          </p>

          <EmailInput
            value={formData.email}
            error={formErrors.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <PasswordInput
            value={formData.password}
            error={formErrors.password}
            onChange={handleChange}
            text="Password"
            placeholder="Enter your password"
          />

          <div className={styles["extra-links"]}>
            {/* <RememberMeCheckbox
              checked={formData.rememberMe}
              onChange={handleChange}
            /> */}
            {/* <Link to={"/forgot-password"}>Forget Password?</Link> */}
          </div>

          <div className={styles["form-group"]}>
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
