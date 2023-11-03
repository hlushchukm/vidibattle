import { useState, useEffect } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  EmailIcon,
} from "react-share";
import { env } from "../env";
import { useShareStore } from "../store";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { getName } from "../services/utils";
import { getUser } from "../services/auth";

export default function SocialMediaShareBtns({
  shareMessage,
}: {
  shareMessage: string;
}) {
  const post = useShareStore((state) => state.post);
  const [title, setTitle] = useState(shareMessage);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (post) {
      setUrl(env.VITE_CLIENT_URL + "/post/" + post._id);
      if (shareMessage.length <= 0) {
        setTitle(post.caption);
      }
    }
  }, [post]);

  useEffect(() => {
    if (shareMessage.length > 0) {
      setTitle(shareMessage);
    } else {
      setTitle(post?.caption ?? "");
    }
  }, [shareMessage]);

  const copyLink = () => {
    if (url.length > 0) {
      navigator.clipboard.writeText(url);
      toast.success("link copied to clipboard");
    } else {
      toast.error("Nothing to copy");
    }
  };

  return (
    <>
      <div className="m-auto overflow-hidden">
        <Swiper
          spaceBetween={"0px"}
          slidesPerView={"auto"}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          <SwiperSlide style={{ width: "60px" }}>
            <FacebookShareButton url={url} quote={title}>
              <FacebookIcon round={true} size={50} />
            </FacebookShareButton>
          </SwiperSlide>
          <SwiperSlide style={{ width: "60px" }}>
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon round={true} size={50} />
            </TwitterShareButton>
          </SwiperSlide>
          <SwiperSlide style={{ width: "60px" }}>
            <LinkedinShareButton
              url={url}
              title={title}
              source={env.VITE_APP_NAME}
            >
              <LinkedinIcon round={true} size={50} />
            </LinkedinShareButton>
          </SwiperSlide>
          <SwiperSlide style={{ width: "60px" }}>
            <TelegramShareButton url={url} title={title}>
              <TelegramIcon round={true} size={50} />
            </TelegramShareButton>
          </SwiperSlide>
          <SwiperSlide style={{ width: "60px" }}>
            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon round={true} size={50} />
            </WhatsappShareButton>
          </SwiperSlide>
          <SwiperSlide style={{ width: "60px" }}>
            <RedditShareButton url={url} title={title}>
              <RedditIcon round={true} size={50} />
            </RedditShareButton>
          </SwiperSlide>
          <SwiperSlide style={{ width: "60px" }}>
            <EmailShareButton
              url={url}
              subject={`${getName(getUser())} Shared a Post With You!`}
              body={title}
            >
              <EmailIcon round={true} size={50} />
            </EmailShareButton>
          </SwiperSlide>
          <SwiperSlide style={{ width: "60px" }}>
            <button
              className="btn btn-primary p-0 rounded-circle"
              style={{ width: 50, height: 50 }}
              onClick={copyLink}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 40 40"
                version="1.1"
                fill="#fff"
              >
                <path d="M 11.789062 16.355469 L 8.359375 19.785156 C 5.429688 22.714844 5.429688 27.464844 8.359375 30.390625 C 11.285156 33.320312 16.035156 33.320312 18.964844 30.390625 L 23.535156 25.820312 C 25.257812 24.097656 26.035156 21.648438 25.625 19.25 C 25.210938 16.851562 23.660156 14.800781 21.464844 13.75 L 20 15.214844 C 19.851562 15.363281 19.722656 15.53125 19.613281 15.710938 C 21.316406 16.203125 22.632812 17.554688 23.074219 19.269531 C 23.515625 20.984375 23.019531 22.804688 21.765625 24.054688 L 17.199219 28.625 C 15.246094 30.578125 12.078125 30.578125 10.125 28.625 C 8.171875 26.671875 8.171875 23.503906 10.125 21.550781 L 12.109375 19.570312 C 11.828125 18.523438 11.71875 17.433594 11.789062 16.351562 Z M 11.789062 16.355469 " />
                <path d="M 16.464844 11.679688 C 14.742188 13.402344 13.964844 15.851562 14.375 18.25 C 14.789062 20.648438 16.339844 22.699219 18.535156 23.75 L 20.472656 21.808594 C 18.746094 21.347656 17.398438 20 16.9375 18.273438 C 16.476562 16.546875 16.96875 14.707031 18.234375 13.445312 L 22.800781 8.875 C 24.753906 6.921875 27.921875 6.921875 29.875 8.875 C 31.828125 10.828125 31.828125 13.996094 29.875 15.949219 L 27.890625 17.929688 C 28.171875 18.980469 28.28125 20.066406 28.210938 21.148438 L 31.640625 17.71875 C 34.570312 14.789062 34.570312 10.039062 31.640625 7.109375 C 28.714844 4.179688 23.964844 4.179688 21.035156 7.109375 Z M 16.464844 11.679688 " />
              </svg>
            </button>
          </SwiperSlide>

          {/* TODO: maybe open the share sheet of the device? */}
        </Swiper>
      </div>
    </>
  );
}
