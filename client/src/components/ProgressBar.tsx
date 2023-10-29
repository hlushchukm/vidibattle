export function ProgressBarStriped({ value }: { value: number }) {
  return (
    <div className="card-body">
      <div className="progress">
        <div
          className={`progress-bar progress-bar-striped ${
            value >= 100 ? "success" : "primary"
          }`}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${value}%` }}
          role="progressbar"
        >
          <span className="sr-only">85% Complete (success)</span>
        </div>
      </div>
    </div>
  );
}
