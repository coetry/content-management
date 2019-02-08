import "./src/css/nprogress.css";
import React from "react";
import Layout from "./src/components/layout";
import { StitchProvider } from "./src/contexts/stitch-context";

export function wrapPageElement({ element, props }) {
  return (
    <StitchProvider>
      <Layout {...props}>{element}</Layout>
    </StitchProvider>
  );
}
