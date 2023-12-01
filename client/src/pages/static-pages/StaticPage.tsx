import { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";
import { get } from "../../services/crud";
import { toast } from "react-toastify";
import StaticPageHeader from "./StaticPageHeader";

export default function StaticPage({ pagename }: { pagename: string }) {
  const [content, setContent] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    fetchPageContent();
    setPageDetails();
  }, []);

  const setPageDetails = () => {
    switch (pagename) {
      case "privacy-policy":
        setPageTitle("Privacy Policy");
        break;
      case "terms-and-conditions":
        setPageTitle("Terms And Conditions");
        break;
    }
  };

  const fetchPageContent = () => {
    get("static-pages/" + pagename)
      .then((res) => {
        setContent(res?.data?.content);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response?.data?.message ?? "Error! couldn't load page");
        setPageLoading(false);
      });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <StaticPageHeader pageTitle={pageTitle} />
      <div className="bg-gradient-2 min-vh-100">
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </>
  );
}
