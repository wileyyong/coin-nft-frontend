import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
`

const LoadingSpinner = () => {
  return (
    <ClipLoader color="black" loading={true} css={override} size={80} />
  )
}

export default LoadingSpinner;