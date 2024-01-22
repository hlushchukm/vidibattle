import { Link } from "react-router-dom";

export default function HeaderLogo() {
  return (
    <Link to="/home">
      <img src="/assets/images/favicon.png" style={{ width: "40px" }} />
    </Link>
  );
}
