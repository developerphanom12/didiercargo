import React from "react";
import styled from "styled-components";
import logo from "../../frontend/assets/Logo.png"
import { Link } from "@shopify/polaris";

export function Login() {
  return (
    <Root>
      <Container className="sign-setion1">
        <Logo className="logo" src={logo} alt="Sitemark" />
        <Title>Sign in</Title>
        <Form className="form-signin">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="your@email.com"
            required
          />

          <Label htmlFor="password">Password</Label>
          <PasswordContainer>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              required
            />
            <ForgotPassword href="#">Forgot your password?</ForgotPassword>
          </PasswordContainer>

          <CheckboxContainer>
            <Checkbox type="checkbox" id="remember-me" />
            <Label htmlFor="remember-me">Remember me</Label>
          </CheckboxContainer>

          <SigninButton className="btn-submit" type="submit">Sign in</SigninButton>
        </Form>

        <SignupText>
          Don't have an account? <Link url="/registerpage">Sign Up</Link>
        </SignupText>


      
      </Container>
    </Root>
  );
}

const Root = styled.section`
img.logo {
    width: 200px;
}
.sign-setion1 h2 {
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

const PasswordContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ForgotPassword = styled.a`
  font-size: 12px;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const SigninButton = styled.button`
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

const GoogleSigninButton = styled.button`
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