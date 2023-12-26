export default function StatusTabs({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: "scheduled" | "started" | "ended";
  onStatusChange: (status: "scheduled" | "started" | "ended") => void;
}) {
  return (
    <div className="social-bar">
      <ul>
        <li
          className={currentStatus === "scheduled" ? "active" : ""}
          onClick={() => onStatusChange("scheduled")}
        >
          <a>
            <h4 className="py-2" style={{ fontSize: "16px" }}>
              Upcoming
            </h4>
          </a>
        </li>
        <li
          className={currentStatus === "started" ? "active" : ""}
          onClick={() => onStatusChange("started")}
        >
          <a>
            <h4 className="py-2" style={{ fontSize: "16px" }}>
              Active
            </h4>
          </a>
        </li>
        <li
          className={currentStatus === "ended" ? "active" : ""}
          onClick={() => onStatusChange("ended")}
        >
          <a>
            <h4 className="py-2" style={{ fontSize: "16px" }}>
              Ended
            </h4>
          </a>
        </li>
      </ul>
    </div>
  );
}
