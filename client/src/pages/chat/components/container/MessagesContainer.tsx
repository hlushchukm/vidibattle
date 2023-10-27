import { useRef } from "react";
import { getDate, getTime } from "../../../../services/timeAndDate";
import { useCurrentUserStore } from "../../../../store";

export default function MessagesContainer({ messages }: { messages: any[] }) {
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
          {messages?.[0] && messages?.[0]?.createdAt && (
            <div className="text-center py-2">
              {getDate(messages?.[0]?.createdAt)}
            </div>
          )}

          {messages.map((message: any, i: number) => {
            const msgDate = getDate(message.createdAt);

            updateLastDate(msgDate);
            return (
              <span key={i}>
                {/* TODO: date display not working */}
                {(msgDate !== lastDate.current || !lastDate) && (
                  <div key={i + "&" + i}>{msgDate}</div>
                )}

                <div
                  key={i}
                  className={`chat-content ${
                    message.sender?._id === currentUserId ? "user" : ""
                  }`}
                >
                  <div className="message-item">
                    <div className="bubble">{message.content}</div>
                    <div className="message-time">
                      {/* {getDateAndTime(message.createdAt)} */}
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
