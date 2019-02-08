import React, { useState, useEffect, useContext } from "react";
import { Link } from "gatsby";
import SEO from "../components/seo";
import { StitchContext } from "../contexts/stitch-context";
import TextInput from "../components/text-input";
import NProgress from "nprogress";

const AdminPage = () => {
  const { state } = useContext(StitchContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState({});

  useEffect(() => {
    console.log(NProgress);
  });

  const uploadImage = async e => {
    NProgress.start();
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "serverless-cms");

    if (typeof window !== undefined) {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/diisq1b7n/image/upload",
        {
          method: "POST",
          body: data
        }
      );

      const imageInfo = await res.json();
      NProgress.done();
      setImg(imageInfo);
    }
  };

  return (
    <div className="container">
      <SEO title="Admin" keywords={[`gatsby`, `application`, `react`]} />
      {state && state.isLoggedIn ? (
        <>
          <h1>admin</h1>

          <form>
            <TextInput
              key={0}
              id="artifact-title"
              placeholder="Title"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
            />
            <TextInput
              key={1}
              id="artifact-description"
              placeholder="description"
              value={description}
              onChange={e => {
                setDescription(e.target.value);
              }}
            />
            <input
              type="file"
              placeholder="UPLOAD IMAGE"
              onChange={uploadImage}
            />
          </form>

          {img && <img src={img.url} />}
        </>
      ) : null}

      <style jsx>{`
        .container {
          max-width: 990px;
          margin: 140px auto 0;
        }
        form {
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
