import React, { useState, useEffect, useContext } from "react";
import { Link } from "gatsby";
import SEO from "../components/seo";
import { StitchContext } from "../contexts/stitch-context";
import Button from "../components/button";
import NProgress from "nprogress";

const IndexPage = () => {
  const value = useContext(StitchContext);
  const [artifacts, setArtifacts] = useState(null);

  useEffect(
    () => {
      console.log(artifacts);
      if (value && value.state && value.state.isLoggedIn && !artifacts) {
        value.state.artifacts
          .find({ owner_id: value.state.user.id })
          .toArray()
          .then(docs => setArtifacts(docs));
      }
    },
    [value, artifacts]
  );

  const deleteArtifact = id => {
    NProgress.start();
    if (value && value.state) {
      console.log(id);
      value.state.artifacts.deleteOne({ _id: id });
      NProgress.done();
      setArtifacts(artifacts.filter(a => a._id != id));
    }
  };

  return (
    <div className="container">
      <SEO title="Gallery" keywords={[`gatsby`, `application`, `react`]} />
      {value && value.state && value.state.isLoggedIn ? (
        <>
          <h3>gallery</h3>
          <p>below is a gallery of images you uploaded</p>
          <div className="artifacts-container">
            {artifacts &&
              artifacts.map(a => (
                <Artifact artifact={a} deleteFn={deleteArtifact} />
              ))}
          </div>
        </>
      ) : null}
      <style jsx>{`
        .container {
          max-width: 990px;
          margin: 140px auto 0;
        }
        .artifacts-container {
          display: flex;
        }
        .artifact {
        }
        h3 {
          text-transform: uppercase;
        }
        p {
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default IndexPage;

const Artifact = ({ artifact, deleteFn }) => (
  <div className="artifact">
    <h3>{artifact.title}</h3>
    <img src={artifact.image_url} width={175} />
    <p>{artifact.description}</p>
    <Button onClick={() => deleteFn(artifact._id)}>delete</Button>
    <style jsx>{`
      .artifact {
        margin: 50px;
      }
      .artifact * {
        margin: 15px 0;
      }
    `}</style>
  </div>
);
