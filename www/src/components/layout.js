import React, { useEffect, useContext } from "react";
import { GoogleRedirectCredential } from "mongodb-stitch-browser-sdk";
import { StitchContext } from "../contexts/stitch-context";
import { Link } from "gatsby";
import TopNav from "./topnav";
import Lock from "./lock";
import Avatar from "./avatar";

export default function Layout({ children }) {
  const value = useContext(StitchContext);
  useEffect(() => {
    if (value.state) {
      if (value.state.client.auth.hasRedirectResult()) {
        console.log("has redirect result");
        value.state.client.auth.handleRedirectResult().then(user => {
          value.setState({ ...value.state, user, isLoggedIn: true });
        });
      }
    }
  });
  return (
    <>
      <TopNav>
        {value.state && !value.state.isLoggedIn ? (
          <div>
            <Lock
              type="sign-in"
              onClick={() => {
                value.state.client.auth.loginWithRedirect(
                  new GoogleRedirectCredential()
                );
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div
              style={{
                display: "flex"
              }}
            >
              <Lock
                type="sign-out"
                onClick={() => {
                  value.state.client.auth
                    .logout()
                    .then(() =>
                      value.setState({ ...value.state, isLoggedIn: false })
                    );
                }}
              />
              {value.state && value.state.user && (
                <Avatar
                  src={value.state.user.profile.pictureUrl}
                  style={{
                    borderRadius: "100%",
                    width: "auto",
                    height: "40px"
                  }}
                />
              )}
            </div>
            <ul style={{ listStyle: "none" }}>
              <li>
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    textTransform: "uppercase",
                    marginRight: "10px"
                  }}
                  activeStyle={{ fontWeight: 700 }}
                >
                  gallery
                </Link>
                <Link
                  to="/admin"
                  style={{ textDecoration: "none", textTransform: "uppercase" }}
                  activeStyle={{ fontWeight: 700 }}
                >
                  admin
                </Link>
              </li>
            </ul>
          </div>
        )}
        <style jsx global>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Helvetica, Arial, sans-serif, "Apple Color Emoji",
              "Segoe UI Emoji", "Segoe UI Symbol";
          }
        `}</style>
      </TopNav>
      {children}
    </>
  );
}
