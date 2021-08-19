/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import Layout from "components/Layout";


interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const layoutView = useRef(null);

  return (
    <Layout className="home-container" ref={layoutView}>
      <div>Home</div>
    </Layout>
  );
};

export default Home;
