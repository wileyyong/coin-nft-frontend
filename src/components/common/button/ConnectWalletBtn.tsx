import React from "react";
import { useAppDispatch } from "store/hooks";
import { connectUserWallet } from "store/User/user.slice";
import { Button } from "react-bootstrap";

interface ConnectWalletBtnProps {}

const ConnectWalletBtn: React.FC<ConnectWalletBtnProps> = () => {
  const dispatch = useAppDispatch();
  const connectWallet = () => {
    dispatch(connectUserWallet());
    document.querySelector('.navbar-collapse')?.classList.remove('show');
    document.querySelector('.navbar-toggler')?.classList.add('collapsed');
  };
  return (
    <Button
      variant="outline-primary"
      className=""
      onClick={() => {
        connectWallet();
      }}
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletBtn;
