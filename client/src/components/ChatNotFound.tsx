export default function ChatNotFound() {
  return (
    <div className="container vh-100">
      <div className="d-flex mt-5 justify-content-center align-items-center flex-column">
        <div className="icon-bx">
          <img
            src="/assets/images/icons/no_chat.png"
            width={250}
            height={250}
          />
        </div>
        <div className="clearfix d-flex flex-column justify-content-center">
          <h2 className="title text-primary pt-2">Chat Not Found</h2>
        </div>
      </div>
    </div>
  );
}
