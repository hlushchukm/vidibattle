import { Link } from "react-router-dom";
import timeAgo from "../../../../services/timeAgo";

export default function ContactsList({ list }: { list: any[] }) {
  // TODO: change current id with loggedin user id
  const currentUserId = "653a5e9300ecfb67556b51aa";

  return (
    <>
      <ul className="dz-list message-list">
        <li>
          {list.map((li: any) => {
            const secondUser =
              li.participants?.[0]?._id === currentUserId
                ? li.participants?.[1]
                : li.participants?.[0];
            return (
              <Link to={li._id}>
                <div className="media media-50">
                  <img
                    className="rounded"
                    src={secondUser?.profile_img}
                    alt="image"
                  />
                </div>
                <div className="media-content">
                  <div>
                    <h6 className="name">
                      {secondUser?.first_name + " " + secondUser?.last_name}
                    </h6>
                    <p className="my-1">{li.messages?.[0]?.content}</p>
                  </div>
                  <div className="left-content" style={{ width: "auto" }}>
                    <span className="time">
                      {timeAgo(li.messages?.[0]?.createdAt)}
                    </span>
                    <div
                      className={`seen-btn mt-2 ${
                        li.messages?.[0]?.seen ? "active" : ""
                      }`}
                    >
                      <svg
                        width="11"
                        height="9"
                        viewBox="0 0 11 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.73609 8.82324L0.161085 4.90081C-0.0536949 4.66516 -0.0536949 4.28308 0.161085 4.0474L0.938884 3.19399C1.15366 2.95832 1.50193 2.95832 1.71671 3.19399L4.125 5.8363L9.28329 0.176739C9.49807 -0.058913 9.84634 -0.058913 10.0611 0.176739L10.8389 1.03015C11.0537 1.2658 11.0537 1.64789 10.8389 1.88356L4.51391 8.82326C4.29911 9.05892 3.95087 9.05892 3.73609 8.82324Z"
                          fill="#BBB6D0"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </li>
      </ul>
    </>
  );
}
