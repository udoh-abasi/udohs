import { IoIosArrowBack } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { Link } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import ChatContacts from "./ChatContacts";

const ChatScreen = () => {
  return (
    <div className="min-[700px]:flex gap-3 relative p-2">
      <div className="hidden min-[700px]:block min-[700px]:mt-2 flex-[0_0_40%]">
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
      </div>

      <main className="mt-8 bg-gray-300 rounded-3xl relative flex-[1_0_auto] min-[700px]:sticky top-3 min-[700px]:mt-4 min-[700px]:h-fit">
        <section className="p-2 rounded-2xl sticky top-0 z-10 bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
          <div className="flex gap-2 items-center">
            <button>
              <IoIosArrowBack className="text-4xl" />
            </button>

            <Link to={``}>
              <figure className="grid grid-cols-[auto_minmax(0,100%)] items-center">
                <div className="relative">
                  <div className="rounded-full overflow-hidden mr-2 w-[40px] h-[40px]">
                    <img
                      alt={``}
                      src={`/Profile_Image_Placeholder-small.jpg`}
                    />
                  </div>
                </div>

                <figcaption className="text-left break-all">
                  <p id="one-line-ellipsis" className="font-bold">
                    {"Udoh Abasiono Sunday"}
                  </p>
                </figcaption>
              </figure>
            </Link>
          </div>

          <div className="text-center font-bold text-lg text-[black]">
            <p id="one-line-ellipsis">iPhone 11 Pro max</p>

            <p id="one-line-ellipsis">$ 5,000,000</p>
          </div>
        </section>

        <section className="min-h-[70vh] max-h-[70vh] overflow-auto">
          <p className="bg-[#0c1317] text-center w-fit p-1 rounded-xl text-sm italic uppercase mx-auto my-2">
            Sat, June 8
          </p>

          <div className="flex justify-end">
            <p className="bg-[#00a884] text-left w-fit max-w-[70%] rounded-lg p-1 m-1 relative">
              <span>
                Hello
                <span className="opacity-0 invisible" aria-hidden>
                  {/* NOTE: This span was added so that the actual text message will not appear on top of the time.*/}
                  Texts
                </span>
              </span>
              <span className="text-sm text-gray-200 align-sub absolute bottom-0 right-1">
                13:25
              </span>
            </p>
          </div>

          <div>
            <p className="bg-[#343f46] text-left w-fit max-w-[70%] rounded-lg p-1 m-1 relative">
              <span>
                Hi
                <span className="opacity-0 invisible" aria-hidden>
                  {/* NOTE: This span was added so that the actual text message will not appear on top of the time.*/}
                  Texts
                </span>
              </span>
              <span className="text-sm text-gray-200 align-sub absolute bottom-0 right-1">
                12:25
              </span>{" "}
            </p>
          </div>
        </section>

        <section className="p-1 flex gap-3 sticky bottom-0 rounded-2xl bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
          <TextareaAutosize
            className="resize-none text-black w-full p-2 border-0 rounded-3xl max-h-[150px] outline-none"
            placeholder="Write a message..."
          />

          <button type="button" className="text-4xl text-[#a1d06d] self-end">
            <IoSend />
          </button>
        </section>
      </main>
    </div>
  );
};

export default ChatScreen;
