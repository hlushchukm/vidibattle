import { useState } from "react";

export default function TruncatedText({
  text,
  maxLength = 700,
}: {
  text: string;
  maxLength?: number;
}) {
  if (!text) return "";

  const [isTruncated, setIsTruncated] = useState(true);

  const handleToggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedText = isTruncated ? text.slice(0, maxLength) + "..." : text;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: truncatedText }} />
      {text.length > maxLength && (
        <button
          onClick={handleToggleTruncate}
          className="btn btn-dark light btn-sm"
        >
          {isTruncated ? "Read More" : "Read Less"}
        </button>
      )}
    </div>
  );
}
