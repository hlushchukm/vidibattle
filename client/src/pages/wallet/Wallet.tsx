import { useEffect, useState } from "react";
import WalletHeader from "./components/WalletHeader";
import PageLoading from "../../components/PageLoading";
import { get } from "../../services/crud";
import { getUserId } from "../../services/auth";
import { toast } from "react-toastify";

export default function Wallet() {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = () => {
    setPageLoading(true);
    get("wallet/" + getUserId() + "/info")
      .then((res) => {
        setWalletInfo(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load wallet info"
        );
        setPageLoading(false);
      });
  };

  const rechargeWallet = () => {
    console.log("recharge clicked");
  };

  if (pageLoading) {
    return <PageLoading />;
  }
  return (
    <>
      <WalletHeader />
    </>
  );
}
