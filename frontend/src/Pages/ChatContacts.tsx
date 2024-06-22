const ChatContacts = () => {
  return (
    <>
      <button className="px-4 py-2 my-2 w-full rounded-2xl bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
        <figure className="grid grid-cols-[auto_minmax(0,100%)] items-center">
          <div className="relative">
            <div className="rounded-full overflow-hidden mr-4 w-[60px] h-[60px]">
              <img alt={``} src={`/Profile_Image_Placeholder-small.jpg`} />
            </div>
          </div>

          <figcaption className="text-left break-all">
            <p
              id="one-line-ellipsis"
              className="font-bold text-lg text-[black]"
            >
              iPhone 11 Pro max
            </p>
            <p id="one-line-ellipsis" className="font-bold">
              {"Udoh Abasiono Sunday"}
            </p>
            <p id="one-line-ellipsis">{"Hello"}</p>
          </figcaption>
        </figure>
      </button>
    </>
  );
};

export default ChatContacts;
