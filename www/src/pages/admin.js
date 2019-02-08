import React, { useState, useEffect, useContext } from "react";
import { Link } from "gatsby";
import SEO from "../components/seo";
import { StitchContext } from "../contexts/stitch-context";

const AdminPage = () => {
  const { state } = useContext(StitchContext);

  return (
    <div className="container">
      <SEO title="Admin" keywords={[`gatsby`, `application`, `react`]} />
      {state && state.isLoggedIn ? <h1>admin</h1> : null}
      <style jsx>{`
        .container {
          max-width: 990px;
          margin: 140px auto 0;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
