import React, { useState, useEffect } from "react";
import { TitleBar, useAppBridge, useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import styled from "styled-components";
import logo from "../../frontend/assets/Logo.png";

export function Register() {




  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    updates: false,
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [storeName, setStoreName] = useState(""); // State to store the shop name
  const fetch = useAuthenticatedFetch();
  const app = useAppBridge(); // Initialize App Bridge

  useEffect(() => {
    // Fetch store name from Shopify API
    const fetchStoreName = async () => {
      try {
        const response = await fetch("/api/test");
        // const data = await response.json();
        // if (data && data.shop && data.shop.name) {
        //   setStoreName(data.shop.name);
        // }
        console.log("res",response)
      } catch (error) {
        console.error("Error fetching store name:", error);
      }
    };

    fetchStoreName();

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setIsRegistered(true);
    }

  }, [app]);


  useEffect(() => {
    async function fetchCollections() {
      try {
        if (!fetch) {
          throw new Error(
            "useAuthenticatedFetch hook not properly initialized."
          );
        }
        const response = await fetch("/api/communityData");
        console.log("respons",response)
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        setCollections(data.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }

    fetchCollections();
  }, [fetch]);
const v1 = window.location.search
console.log("v1",v1)
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(formData));
    console.log("Form data stored in localStorage:", formData);
    setIsRegistered(true);
  };
  const [storeNames, setStoreNames] = useState("");

  useEffect(() => {
    // Extract the 'shop' parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
     console.log(shop ,"Hello")

    if (shop) {
      setStoreNames(shop);
    }
  }, []);
  return (
    <DD>
      <Page fullWidth>
        <TitleBar title="Signing Up" />
        <Container className="register-section1">
          {isRegistered ? (
            <>
              <h1>
                Welcome to {storeNames}, {JSON.parse(localStorage.getItem("userData")).fullName}!
              </h1>
              <a
                href="http://localhost:3000/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to your Cargo Insurance Dashboard
              </a>
            </>
          ) : (
            <>
              <Logo className="logo" src={logo} alt="Sitemark" />
              <Title>Sign Up</Title>
              <Form onSubmit={handleFormSubmit}>
                <Label htmlFor="full-name">Full name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Jon Snow"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />

                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />

                <SignupButton type="submit">Sign Up</SignupButton>
              </Form>
            </>
          )}
        </Container>
      </Page>
    </DD>
  );
}


const DD = styled.section`
  img.logo {
    width: 200px;
  }
  .register-setion1 h2 {
    font-weight: 600;
    font-size: 28px;
  }
`;
const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

const Logo = styled.img`
  display: block;
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const SignupButton = styled.button`
  background-color: #000;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: #333;
  }
`;

const SignupText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Separator = styled.div`
  text-align: center;
  margin: 20px 0;
  position: relative;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #ccc;
  }

  &:before {
    left: 0;
  }

  &:after {
    right: 0;
  }
`;

const GoogleSignupButton = styled.button`
  background-color: white;
  color: #555;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;
