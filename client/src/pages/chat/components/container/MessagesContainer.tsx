import { useRef } from "react";
import { getDate, getTime } from "../../../../services/timeAndDate";
import { useCurrentUserStore } from "../../../../store";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";
import { formatMessageText } from "../../../../services/text-formatting";

export default function MessagesContainer({
  messages,
  tempMessages,
  loading,
  showMoreBtn,
  messageComponentsRef,
  loadMore,
}: {
  messages: any[];
  tempMessages: any[];
  loading: boolean;
  showMoreBtn: boolean;
  messageComponentsRef: React.MutableRefObject<{
    [key: string]: HTMLElement;
  }>;
  loadMore: () => void;
}) {
  const currentUserId = useCurrentUserStore((s: any) => s.id);
  const lastDate = useRef<string | null>();

  const updateLastDate = (date: string) => {
    if (!lastDate.current || lastDate.current !== date) {
      lastDate.current = date;
    }
  };

  return (
    <>
      <div className="page-content message-content bottom-content d-flex align-items-end">
        <div className="container chat-box-area">
          {messages.length <= 0 && tempMessages.length <= 0 && !loading && (
            <h5 className="d-flex justify-content-center align-items-center py-5 text-secondary">
              Start a New Chat
            </h5>
          )}

          {!loading && messages.length > 0 && (
            <div className="d-flex justify-content-center align-items-center">
              {showMoreBtn && (
                <button className="btn text-primary" onClick={loadMore}>
                  <i className="fa fa-refresh me-2"></i>
                  <span>Show More</span>
                </button>
              )}
              {!showMoreBtn && (
                <div className="divider divider-dashed border-warning inner-divider transparent mb-0">
                  <span style={{ background: "#eee" }}>Start of Chat</span>
                </div>
              )}
            </div>
          )}

          {loading && <BlinkingLoadingCircles />}

          {messages.map((message: any, i: number) => {
            const msgDate = getDate(message.createdAt);
            const lastDateCopy = lastDate.current;

            updateLastDate(msgDate);
            return (
              <span
                key={i}
                ref={(el) =>
                  (messageComponentsRef.current[message._id] =
                    el as HTMLElement)
                }
              >
                {(msgDate !== lastDateCopy || !lastDate) && (
                  <div className="divider border-info inner-divider transparent mb-0">
                    <span style={{ background: "#eee" }}>{msgDate}</span>
                  </div>
                )}
                <div
                  className={`chat-content ${
                    message.sender === currentUserId ? "user" : ""
                  }`}
                >
                  <div className="message-item">
                    <div className="bubble">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMessageText(message.content),
                        }}
                        style={{ lineBreak: "anywhere" }}
                      />
                    </div>
                    <div
                      className="message-time"
                      style={{ paddingBottom: "10px" }}
                    >
                      {getTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              </span>
            );
          })}

          {/* Show Temporary Messages */}
          {tempMessages.map((message: any, i: number) => {
            return (
              <span key={i}>
                <div
                  key={i}
                  className={`chat-content ${
                    message.sender === currentUserId ? "user" : ""
                  }`}
                >
                  <div className="message-item">
                    <div className="bubble">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMessageText(message.content),
                        }}
                        style={{ lineBreak: "anywhere" }}
                      />
                    </div>
                    <div
                      className="message-time"
                      style={{ paddingBottom: "10px" }}
                    >
                      {getTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
