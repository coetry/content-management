import React from "react";

const Avatar = ({ src }) => (
  <div className="avatar-container">
    <img src={src} />
    <style jsx>{`
      .avatar-container {
        height: 35px;
        width: fit-content;
        margin: auto 10px;
      }

      img {
        filter: grayscale(100%);
        height: 100%;
        width: auto;
        border-radius: 100%;
      }
    `}</style>
  </div>
);

export default Avatar;
