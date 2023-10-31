import { useState } from "react";
import CommentInput from "../ui/CommentInput";

export default function CommentsContainer() {
  const [commentText, setCommentText] = useState("");

  const sendComment = (e: any) => {
    e.preventDefault();
    if (commentText.length > 0) {
      setCommentText("");
    }
  };
  return (
    <div className="card bg-light p-3">
      <h6 className="">Comments</h6>
      <div className="divider border-secondary mt-1"></div>

      <ul className="dz-comments-list">
        <li>
          <div className="list-content">
            <img src="assets/images/stories/small/pic1.jpg" alt="/" />
            <div>
              <h6 className="font-14 mb-1">Lucas Mokmana</h6>
              <p className="mb-2">
                Awesome app i ever used. great structure, and customizable for
                multipurpose. 😀😀
              </p>
              <ul className="bottom-item">
                <li className="text-light">3 Like</li>
                <li className="text-light">Reply</li>
                <li className="text-light">Send</li>
              </ul>
            </div>
          </div>
          <div className="ms-auto">
            <div className="like-button">
              <i className="fa-regular fa-heart ms-auto"></i>
            </div>
          </div>
        </li>
        <li className="parent-list">
          <div className="list-content">
            <img src="assets/images/stories/small/pic2.jpg" alt="/" />
            <div>
              <h6 className="font-14 mb-1">Lucas</h6>
              <p className="mb-2">Yes I am also use this.🙂</p>
              <ul className="bottom-item">
                <li className="text-light">Reply</li>
                <li className="text-light">Send</li>
              </ul>
            </div>
          </div>
          <div className="ms-auto">
            <div className="like-button">
              <i className="fa-regular fa-heart ms-auto"></i>
            </div>
          </div>
        </li>
        <li className="parent-list">
          <CommentInput
            commentText={commentText}
            onChange={setCommentText}
            onSubmit={sendComment}
          />
        </li>
        <li className="parent-list">
          <div className="list-content">
            <img src="assets/images/stories/small/pic2.jpg" alt="/" />
            <div>
              <h6 className="font-14 mb-1">John Doe</h6>
              <p className="mb-2">Really Nice.👍</p>
              <ul className="bottom-item">
                <li className="text-light">Reply</li>
                <li className="text-light">Send</li>
              </ul>
            </div>
          </div>
          <div className="ms-auto">
            <div className="like-button">
              <i className="fa-regular fa-heart ms-auto"></i>
            </div>
          </div>
        </li>
        <li>
          <div className="list-content">
            <img src="assets/images/stories/small/pic3.jpg" alt="/" />
            <div>
              <h6 className="font-14 mb-1">Hendri Lee</h6>
              <p className="mb-2">Nice work... 😍😍</p>
              <ul className="bottom-item">
                <li className="text-light">2 Like</li>
                <li className="text-light">Reply</li>
                <li className="text-light">Send</li>
              </ul>
            </div>
          </div>
          <div className="ms-auto">
            <div className="like-button">
              <i className="fa-regular fa-heart ms-auto"></i>
            </div>
          </div>
        </li>
        <li>
          <div className="list-content">
            <img src="assets/images/stories/small/pic4.jpg" alt="/" />
            <div>
              <h6 className="font-14 mb-1">Brian Harahap</h6>
              <p className="mb-2">
                We will always be friends until we are so old and senile.
              </p>
              <ul className="bottom-item">
                <li className="text-light">7 Like</li>
                <li className="text-light">Reply</li>
                <li className="text-light">Send</li>
              </ul>
            </div>
          </div>
          <div className="ms-auto">
            <div className="like-button">
              <i className="fa-regular fa-heart ms-auto"></i>
            </div>
          </div>
        </li>
        <li className="">
          <CommentInput
            commentText={commentText}
            onChange={setCommentText}
            onSubmit={sendComment}
          />
        </li>
        <li>
          <div className="list-content">
            <img src="assets/images/stories/small/pic5.jpg" alt="/" />
            <div>
              <h6 className="font-14 mb-1">Dons John</h6>
              <p className="mb-2">
                Wow, you are flawless, intelligent, and bright.🤗🤗
              </p>
              <ul className="bottom-item">
                <li className="text-light">2 Like</li>
                <li className="text-light">Reply</li>
                <li className="text-light">Send</li>
              </ul>
            </div>
          </div>
          <div className="ms-auto">
            <div className="like-button">
              <i className="fa-regular fa-heart ms-auto"></i>
            </div>
          </div>
        </li>
        <li>
          <div className="list-content">
            <img src="assets/images/stories/small/pic6.jpg" alt="/" />
            <div>
              <h6 className="font-14 mb-1">Eric Leew</h6>
              <p className="mb-2">
                Finding a loving, cute, generous, caring, and intelligent pal is
                so hard. So, my advice to you all in the picture, never lose me.
              </p>
              <ul className="bottom-item">
                <li className="text-light">2 Like</li>
                <li className="text-light">Reply</li>
                <li className="text-light">Send</li>
              </ul>
            </div>
          </div>
          <div className="ms-auto">
            <div className="like-button">
              <i className="fa-regular fa-heart ms-auto"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
