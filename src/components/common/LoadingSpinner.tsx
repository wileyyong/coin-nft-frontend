import { css } from "@emotion/react";
import ScaleLoader from "react-spinners/ScaleLoader";

const override = css`
  display: block;
  margin: 0 auto;
`

const LoadingSpinner = () => {
  return (
    <div className="loading-wrapper">
      <ScaleLoader color={"#1E76FF"} height={50} width={6} loading={true} css={override} />
    </div>
  )
}

export default LoadingSpinner;