export default function TopNavBarWrapper({ children }: { children: any }) {
  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="main-bar">{children}</div>
        </div>
      </header>
      <div className="dark-overlay"></div>
      {/* Header End  */}
    </>
  );
}
