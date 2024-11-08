import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient, { profilePictureURL } from "../utils/axiosSetup";
import Loader from "../utils/loader";
import { useNavigate } from "react-router-dom";
import { chat } from "../utils/tsInterface";
import { TiTick } from "react-icons/ti";
import { FaDotCircle } from "react-icons/fa";
import { forwardRef, useImperativeHandle } from "react";

// NOTE: THIS IS THE SAMPLE RESULT THAT WE WILL GET, IF WE DO 'console.log(data)'
// NOTE: SO, IN THIS RESULT WE GOT TWO CHATS

// [
//   {
//       "_id": "670d0cf0af48b35cc7d21e7b",
//       "lastMessage": "New",
//       "readByReceiver": false,
//       "lastMessageDateAndTime": "2024-10-29T13:25:51.858Z",
//       "productTitle": "Testing the edit",
//       "otherPartnerID": "670d0a61a8b7a17e96b828f6",
//       "isCurrentUserTheLastMessageReceiver": false,
//       "otherPartnerFullName": "Udoh Abasi",
//       "otherPartnerProfilePicture": null,
//       "receiverID": "67021a5890f8b6ed17771bd5",
//       "lastMessageID": "67021a5890f8b6ed17771bd5"
//   },
//
//   {
//       "_id": "670d0cf0af48b35cc7d21e7a",
//       "lastMessage": "No",
//       "readByReceiver": false,
//       "lastMessageDateAndTime": "2024-10-29T12:57:51.957Z",
//       "productTitle": "Testing the edit",
//       "otherPartnerID": "67021a5890f8b6ed17771bd5",
//       "isCurrentUserTheLastMessageReceiver": true,
//       "otherPartnerFullName": "Elizabeth Paul",
//       "otherPartnerProfilePicture": null,
//       "receiverID": "67021a5890f8b6ed17771bd5",
//       "lastMessageID": "67021a5890f8b6ed17771bd5"
//   }
// ]

// The 'forwardRef' was added because there are functions in this 'ChatContacts' we want to directly call on the parent component
// NOTE: We prefixed 'props' with an underscore, since it's not used in this code. This is to avoid TS warnings
const ChatContacts = forwardRef((_props, ref) => {
  const navigate = useNavigate();

  // We fetch the contacts that this user has chatted with
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => (await axiosClient.get(`/api/chats`)).data,
  });

  // This will be used to set the data of useQuery (using queryClient.setQueryData). Similar to 'setData', when using 'useState'
  const queryClient = useQueryClient();

  // We want to optimistically update th contact when a user sends a new message (or receives a new message)
  // This just takes the recent contact to the top of the page
  const updateContactData = (
    chatID: string,
    theMessage: string,
    todaysDateAndTime: string,
    isCurrentUserTheLastMessageReceiver: boolean
  ) => {
    // Get the index of the chat we want to move to the top
    const theChatIndex = data.findIndex(
      (eachChat: chat) => eachChat._id === chatID
    );

    // 'theChatIndex' will be '-1' if no match was found
    if (theChatIndex !== -1) {
      const newData = [...data]; // Make a copy of the data

      // Remove the chat from the array
      // Splice will return the removed item
      let theChat = newData.splice(theChatIndex, 1)[0];

      // Update some fields in the chat
      theChat = {
        ...theChat, // First, we spread in the old chat data
        lastMessage: theMessage, // Update the last message
        readByReceiver: false, // We assume it has not been read by the receiver yet
        lastMessageDateAndTime: todaysDateAndTime, // We use the same date and time from 'chatScreen.tsx' to ensure consistency
        isCurrentUserTheLastMessageReceiver,
      };

      // NOTE: This sets the useQuery's data to our new data
      queryClient.setQueryData(["chat"], [theChat, ...newData]);
    }
  };

  // 'useImperativeHandle' is used to attach the function to the ref, so it can be available to be called in the parent component.
  useImperativeHandle(ref, () => ({
    updateContactData, // This takes an object
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    navigate("/");
    return <></>;
  }

  return (
    <>
      {data.length ? (
        <>
          {data.map((eachChat: chat) => {
            return (
              <button
                key={eachChat._id}
                className="px-4 py-2 my-2 w-full rounded-2xl relative bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                onClick={async () => {
                  // Check if the currently logged in user is the receiver of the last message, and if the last message has been ready by the receiver
                  if (
                    eachChat.isCurrentUserTheLastMessageReceiver &&
                    !eachChat.readByReceiver
                  ) {
                    // Quickly mark the chat as 'read'.
                    const newData = data.map((theData: chat) => {
                      if (eachChat._id === theData._id) {
                        return {
                          ...theData,
                          readByReceiver: true,
                        };
                      } else {
                        return theData;
                      }
                    });

                    queryClient.setQueryData(["chat"], newData);

                    // Then update the last message on the backend (for backend to know it has been read by the receiver)
                    // Send request to backend to mark last message as read
                    await axiosClient.put(
                      `/api/markmessageasread/${eachChat.lastMessageID}`
                    );
                  }

                  // Push the user to the page to see all chats
                  navigate(`/chat/${eachChat._id}`);
                }}
              >
                <figure className="grid grid-cols-[auto_minmax(0,100%)] items-center">
                  <div className="relative">
                    <div className="rounded-full overflow-hidden mr-4 w-[60px] h-[60px]">
                      <img
                        alt={``}
                        src={
                          eachChat.otherPartnerProfilePicture
                            ? `${profilePictureURL}/${eachChat.otherPartnerProfilePicture}`
                            : `/Profile_Image_Placeholder-small.jpg`
                        }
                      />
                    </div>
                  </div>

                  <figcaption className="text-left break-all">
                    <p
                      id="one-line-ellipsis"
                      className="font-bold text-lg text-[black]"
                    >
                      {eachChat.productTitle}
                    </p>
                    <p id="one-line-ellipsis" className="font-bold">
                      {eachChat.otherPartnerFullName}
                    </p>

                    <p className="text-xs">
                      <span className="flex items-center">
                        <span>
                          {!eachChat.isCurrentUserTheLastMessageReceiver && (
                            <TiTick className="text-lg" />
                          )}
                        </span>
                        <span id="two-line-ellipsis">
                          {eachChat.lastMessage}
                        </span>
                      </span>
                    </p>
                  </figcaption>
                </figure>

                {eachChat.isCurrentUserTheLastMessageReceiver &&
                  !eachChat.readByReceiver && (
                    <span className="absolute top-9 right-1">
                      <FaDotCircle color="green" className="text-3xl" />
                    </span>
                  )}
              </button>
            );
          })}
        </>
      ) : (
        <p className="text-xl italic font-bold text-black px-4 py-2 my-2 w-full rounded-2xl">
          You have no chats at the moment
        </p>
      )}
    </>
  );
});

export default ChatContacts;
