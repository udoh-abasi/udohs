import ChatContacts from "./ChatContacts";

const Chat = () => {
  return (
    <main className="min-h-screen p-4 min-[700px]:flex gap-3 relative">
      <div className="flex-[0_0_40%]">
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
        <ChatContacts />
      </div>

      <picture
        id="chatSketch"
        className="hidden min-[700px]:flex justify-center items-center p-2 sticky top-3 h-screen mt-2 flex-[1_0_60%] bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-3xl "
      >
        <img src="/chatSketch.svg" alt="Chat svg" />
      </picture>
    </main>
  );
};

export default Chat;
