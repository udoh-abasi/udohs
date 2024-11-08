import { IoIosArrowBack } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import ChatContacts from "./ChatContacts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient, {
  backendURL,
  profilePictureURL,
} from "../utils/axiosSetup";
import Loader from "../utils/loader";
import { theMessageInterface } from "../utils/tsInterface";
import { useSelector } from "react-redux";
import { userSelector } from "../reduxFiles/selectors";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// NOTE: THIS IS THE SAMPLE RESULT THAT WE WILL GET, IF WE DO 'console.log(data)'

//   {
//      "productID": "66f6b6c50943865aedd01cf5",

//     "otherPartnerID": "67021a5890f8b6ed17771bd5",

//     "otherPartnerFullName": "Elizabeth Paul",

//     "otherPartnerProfilePicture": "Udoh Abasi_2024-09-23T16-25-54.888Z.jpeg",

//     "productTitle": "Testing the edit",

//     "productCurrency": "36",

//     "productAmount": "1,000"

//     "groupedMessages": {
//         "2024-08-21": [  // NOTE: I HAVE JUST ONE MESSAGE FOR THIS DATE
//             {
//                 "_id": "67131dafbb23849b1bc7ce3f",
//                 "senderID": "66f1675f6965d3bd910943d8",
//                 "receiverID": "67021a5890f8b6ed17771bd5",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "Hello",
//                 "dateAndTime": "2024-08-21T12:40:39.171Z",
//                 "readByReceiver": false
//             }
//         ],

//         "2024-08-25": [    // NOTE: I HAVE THREE MESSAGES FOR THIS DATE
//             {
//                 "_id": "67131df2bb23849b1bc7ce40",
//                 "senderID": "67021a5890f8b6ed17771bd5",
//                 "receiverID": "670d0a61a8b7a17e96b828f6",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "How is life",
//                 "dateAndTime": "2024-08-25T10:00:39.171Z",
//                 "readByReceiver": false
//             },
//             {
//                 "_id": "670d0b56af48b35cc7d21e6e",
//                 "senderID": "66f1675f6965d3bd910943d8",
//                 "receiverID": "67021a5890f8b6ed17771bd5",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "Hello",
//                 "dateAndTime": "2024-08-25T10:11:39.171Z",
//                 "readByReceiver": false
//             },
//             {
//                 "_id": "670d0b56af48b35cc7d21e6f",
//                 "senderID": "66f1675f6965d3bd910943d8",
//                 "receiverID": "67021a5890f8b6ed17771bd5",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "Hi",
//                 "dateAndTime": "2024-08-25T10:12:39.171Z",
//                 "readByReceiver": false
//             }
//         ]
//     },
// }

const ChatScreen = () => {
  const socket = io(backendURL, {
    // Options
    withCredentials: true,
  });

  // Get the chatID from the URL
  const { chatID } = useParams();

  // This is the interface for the child component
  interface childRefInterface {
    updateContactData: (
      chatID: string,
      theMessage: string,
      todaysDateAndTime: string,
      isCurrentUserTheLastMessageReceiver: boolean
    ) => void;
  }

  // This is the ref that will be attached to child component, which we want to call it function
  const childRef = useRef<childRefInterface | null>(null);

  const navigate = useNavigate();

  const theUserSelector = useSelector(userSelector);
  const user = theUserSelector.userData;

  // This holds the messages that the user types on the field (i.e, messages to be sent)
  const [message, setMessage] = useState("");

  // This will be used to set the data of useQuery (using queryClient.setQueryData). Similar to 'setData', when using 'useState'
  const queryClient = useQueryClient();

  // When we have a lot of messages on the screen, new messages are hidden (until you scroll down to see them).
  // We want the page to scroll so the newest messages will be seen always
  // This was added to fix that
  // This ref is attached to a <div>, which is at the end of all the chat messages
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch the chat messages, using the ID
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chatMessage", chatID],
    queryFn: async () =>
      (await axiosClient.get(`/api/chatmessage/${chatID}`)).data,
  });

  // So, this useEffect runs anytime the data changes (i.e, a new message is added), to show the latest message
  useEffect(() => {
    // Scroll to the show the invisible <div> whenever a new message is added. Since this <div> is after the latest message, the latest message will always appear visible.
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end", // This will ensure, if the div was hidden, it will scroll to the bottom-end of the page, however, if it is already visible on the page, it will NOT scroll
      inline: "nearest",
    });
  }, [data]);

  if (isError) {
    navigate("/");
    return <></>;
  }

  const getHourAndMinute = (dateString: string) => {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Get the hours and minutes, and format them to always be 2 digits. The 'padStart' pads with leading zeros if necessary
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Return the formatted time
    return `${hours}:${minutes}`;
  };

  // This function optimistically updates the UI with both the message sent, and message received
  // Since messages are group based on the date they were sent, we want to first check if a message already exist in today's date, so we update the message array, else add the date and the array
  const optimisticallyAddMessageOnFrontend = (
    todaysDate: string,
    todaysDateAndTime: string,
    trimmedMessage: string,
    senderID?: string,
    receiverID?: string,
    productID?: string
  ) => {
    const todaysDateMessages = data.groupedMessages[todaysDate]
      ? // If today's date already exist, then we add old messages using the spread operator, and then add the new message
        [
          ...data.groupedMessages[todaysDate], // Add old messages
          // Add the new message
          {
            _id: todaysDateAndTime, // Since no two date and time can be the same, we use it as the temporary ID, until the backend actually assigns a permanent ID
            senderID: senderID ? senderID : user?.id, // The current user is obviously the sender (if this function is called in the 'AddNewMessage' function), however, if this function is called in 'socket.on("chatFromBackend"', then he will be the receiver
            receiverID: receiverID ? receiverID : "",
            productID: productID ? productID : "",
            message: trimmedMessage,
            dateAndTime: todaysDateAndTime, // Set the current date and time.
            readByReceiver: false,
          },
        ]
      : // If today's date DOES NOT exist, we add the new message as the only message for this date
        [
          {
            _id: todaysDateAndTime,
            senderID: senderID ? senderID : user?.id,
            receiverID: receiverID ? receiverID : "",
            productID: productID ? productID : "",
            message: trimmedMessage,
            dateAndTime: todaysDateAndTime,
            readByReceiver: false,
          },
        ];

    // Create the new data
    const newData = {
      ...data, // Add the old data

      // Update just the groupMessages object, which is a key-value pair (i.e date: [message, message])
      groupedMessages: {
        ...data.groupedMessages, // Add old messages with their date
        [todaysDate]: todaysDateMessages, // Add the current date with the messages
      },
    };

    // NOTE: This sets the useQuery's data to our new data
    // So, we update the chat between this two users.
    queryClient.setQueryData(["chatMessage", chatID], newData);
  };

  socket.on("chatFromBackend", (msg) => {
    console.log(msg);

    optimisticallyAddMessageOnFrontend(
      msg.dateAndTime.split("T")[0],
      msg.dateAndTime,
      msg.message,
      msg.senderID,
      msg.receiverID,
      msg.productID
    );

    // Update the chat list for the receiver
    // So, here, we call the 'updateContactData' which is a function in the child component
    // This will take the chatID, and move the chat with that ID to the top of the contacts
    if (childRef.current && chatID) {
      childRef.current.updateContactData(
        chatID,
        msg.message,
        msg.dateAndTime,
        true
      );
    }
  });

  // When a user sends a new message. This adds the message to the message list, and also moves the chat with that contact up
  const AddNewMessage = async () => {
    // Remove leading and trailing white spaces from the message
    const trimmedMessage = message.trim();

    // First, we get today's date ONLY. So we take out the time
    const todaysDate = new Date().toISOString().split("T")[0];

    const todaysDateAndTime = new Date().toISOString();

    // Before sending the message to the backend, we want to optimistically update the UI
    optimisticallyAddMessageOnFrontend(
      todaysDate,
      todaysDateAndTime,
      trimmedMessage
    );

    // So, here, we call the 'updateContactData' which is a function in the child component
    // This will take the chatID, and move the chat with that ID to the top of the contacts
    if (childRef.current && chatID) {
      childRef.current.updateContactData(
        chatID,
        trimmedMessage,
        todaysDateAndTime,
        false
      );

      // Send the message to the backend, to store in the database, update the lastMessageID and then send the message to the other chatPartner
      socket.emit("chatFromFrontend", {
        trimmedMessage,
        to: data.otherPartnerID,
        productID: data.productID,
        chatID,
      });
    }

    // Reset the message field
    setMessage("");
  };

  try {
    return (
      <div className="min-[700px]:flex justify-between relative p-2">
        <div className="hidden min-[700px]:block min-[700px]:mt-2 flex-[0_0_39%]">
          {/* Placing the ref here makes us access functions of the child component, which will be available on 'childRef.current' */}
          <ChatContacts ref={childRef} />
        </div>

        <main className="mt-8 bg-gray-300 rounded-3xl relative flex-[0_0_59%] min-[700px]:sticky top-3 min-[700px]:mt-4 min-[700px]:h-fit">
          {isLoading ? (
            <div className="min-h-screen grid place-items-center">
              <Loader />
            </div>
          ) : (
            <>
              <section className="p-2 rounded-2xl sticky top-0 z-10 bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      navigate("/chat");
                    }}
                  >
                    <IoIosArrowBack className="text-4xl" />
                  </button>

                  <figure className="grid grid-cols-[auto_minmax(0,100%)] items-center">
                    <div className="relative">
                      <div className="rounded-full overflow-hidden mr-2 w-[40px] h-[40px]">
                        <img
                          alt={``}
                          src={
                            data.otherPartnerProfilePicture
                              ? `${profilePictureURL}/${data.otherPartnerProfilePicture}`
                              : `/Profile_Image_Placeholder-small.jpg`
                          }
                        />
                      </div>
                    </div>

                    <figcaption className="text-left break-all">
                      <p id="one-line-ellipsis" className="font-bold">
                        {data.otherPartnerFullName}
                      </p>
                    </figcaption>
                  </figure>
                </div>

                <div className="text-center font-bold text-lg text-[black]">
                  <p id="one-line-ellipsis">{data.productTitle}</p>

                  <p id="one-line-ellipsis">
                    {/* NOTE: This is how we convert the code to HTML Entity. So, for e.g, the entity for naira is '&#8358;', however, what we stored in the backend is just the number, i.e '8358'. So, we we converted that code back to html entity (i.e &#8358;) */}
                    {String.fromCharCode(Number(data?.productCurrency))}
                    {data?.productAmount}
                  </p>
                </div>
              </section>

              <section className="min-h-[70vh] max-h-[70vh] overflow-auto">
                {Object.entries(
                  data.groupedMessages as Record<string, theMessageInterface[]>
                ).map((eachDateAndMessages) => {
                  return (
                    <div key={eachDateAndMessages[0]}>
                      <p className="bg-[#0c1317] text-center w-fit p-1 rounded-xl text-sm italic uppercase mx-auto my-2">
                        {/* This is the messages date */}
                        {eachDateAndMessages[0]}
                      </p>

                      {/* Map through the messages array and return each message */}
                      {eachDateAndMessages[1].map((message) => {
                        if (message.senderID === user?.id) {
                          return (
                            <div className="flex justify-end" key={message._id}>
                              <p className="bg-[#00a884] text-left w-fit max-w-[70%] rounded-lg p-1 m-1 relative">
                                <span className="break-all">
                                  {message.message}
                                  <span
                                    className="inline-block w-[35px] h-[10px]"
                                    aria-hidden
                                  >
                                    {/* NOTE: This empty span was added so that the actual text message will not appear on top of the time.*/}
                                    {/* NOTE: It is a hack to ensure the time appears below the actual message*/}
                                  </span>
                                </span>
                                <span className="text-xs text-gray-200 align-sub absolute bottom-0 right-1">
                                  {getHourAndMinute(message.dateAndTime)}
                                </span>
                              </p>
                            </div>
                          );
                        } else {
                          return (
                            <div key={message._id}>
                              <p className="bg-[#343f46] text-left w-fit max-w-[70%] rounded-lg p-1 m-1 relative">
                                <span className="break-all">
                                  {message.message}
                                  <span
                                    className="inline-block w-[35px] h-[10px]"
                                    aria-hidden
                                  >
                                    {/* NOTE: This empty span was added so that the actual text message will not appear on top of the time.*/}
                                    {/* NOTE: It is a hack to ensure the time appears below the actual message*/}
                                  </span>
                                </span>
                                <span className="text-xs text-gray-200 align-sub absolute bottom-0 right-1">
                                  {getHourAndMinute(message.dateAndTime)}
                                </span>{" "}
                              </p>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })}

                {/* Empty div to mark the end of the chat */}
                {/* Since the height of the text field for typing messages is about 50px, we made the height here 50px, so the text field will not cover the actual text  */}
                {/* So, we set up our code that, this <div> will always scroll into the viewport, whenever a new message is added, in order to show the new message */}
                <div
                  className="w-0 h-[50px] scroll-my-[60px]"
                  ref={chatEndRef}
                ></div>
              </section>

              <form className="p-1 flex gap-3 sticky bottom-0 rounded-2xl bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                <TextareaAutosize
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  className="resize-none text-black w-full p-2 border-0 rounded-3xl max-h-[150px] outline-none"
                  placeholder="Write a message..."
                />

                <button
                  type="button"
                  aria-label="Send"
                  title="Send"
                  className="text-4xl text-[green] self-end"
                  onClick={() => {
                    if (message.trim()) {
                      AddNewMessage();
                    }
                  }}
                >
                  <IoSend />
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    );
  } catch {
    navigate("/");
  }
};

export default ChatScreen;
