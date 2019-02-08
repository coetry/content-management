import React from "react";

const TopNav = ({ children, ...props }) => (
  <header {...props}>
    <div className="content">{children}</div>
    <style jsx>{`
      header {
        width: 100vw;
        height: 90px;
        background: #fff;
        border-bottom: 1px solid #eaeaea;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
        margin-bottom: 120px;
      }
      .content {
        display: flex;
        align-items: center;
        margin: 0 auto;
        max-width: 1024px;
        height: 100%;
        padding: 0 24px;
        position: relative;
      }
    `}</style>
  </header>
);

export default TopNav;
