import { useNavigate } from "react-router-dom";

export default function BackBtn({ to }: { to?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="back-btn btn"
    >
      <i className="fa-solid fa-arrow-left"></i>
    </button>
  );
}
