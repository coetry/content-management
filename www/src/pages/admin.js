import React, { useState, useEffect, useContext } from "react";
import { Link, navigate } from "gatsby";
import SEO from "../components/seo";
import { StitchContext } from "../contexts/stitch-context";
import Button from "../components/Button";
import TextInput from "../components/text-input";
import NProgress from "nprogress";

const AdminPage = () => {
  const { state } = useContext(StitchContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);

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

  const addToGallery = e => {
    NProgress.start();
    state.artifacts
      .insertOne({
        owner_id: state.user.id,
        title,
        description,
        image_url: img.url
      })
      .then(() => {
        NProgress.done();
        navigate("/");
      })
      .catch(console.error);
  };

  return (
    <div className="container">
      <SEO title="Admin" keywords={[`gatsby`, `application`, `react`]} />
      {state && state.isLoggedIn ? (
        <>
          <h1>admin</h1>
          <div className="create-artifact-container">
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
              <input type="file" onChange={uploadImage} />
            </form>
            <div className="preview">
              {img && (
                <div>
                  <img src={img.url} width={300} />
                  <Button onClick={addToGallery}>add to gallery</Button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}

      <style jsx>{`
        .container {
          max-width: 990px;
          margin: 140px auto 0;
        }
        .create-artifact-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: space-even;
        }
        form {
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
