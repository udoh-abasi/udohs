import { udohsDatabase } from "./mongoDBClient";

const createCollections = async () => {
  try {
    // Create the collection to store the email and the verification code
    const emailAndVerificationCodeCollection =
      await udohsDatabase.createCollection("emailAndVerificationCode", {
        validator: {
          $jsonSchema: {
            bsonType: "object", // NOTE: This means the collection will be an object

            title: "Email and Verification Code object validation",

            required: ["email", "code"], // State the required fields in the collection

            properties: {
              email: {
                bsonType: "string", // Email field should be a string
                description: "'email' must be a string and is required",
              },

              code: {
                bsonType: "string", // Code field should be a string also
                description: "'code' must be a string and is required",
              },

              isVerified: {
                bsonType: "bool", // Code field should be a string also
                description: "'isVerified' must be a boolean and is required",
              },
            },
          },
        },
      });

    // Create a unique index on the email field. This ensures no two same values of the email field is saved
    await emailAndVerificationCodeCollection.createIndex(
      { email: 1 },
      { unique: true }
    );

    // Create the collection to store a user
    const userCollection = await udohsDatabase.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object", // NOTE: This means the collection will be an object

          title: "Users object validation",

          // State the required fields in the collection
          required: [
            "email",
            "password",
            "provider",
            "phoneNumber",
            "fullName",
            "dateJoined",
          ],

          // Define what each fields should contain
          properties: {
            email: {
              bsonType: "string", // Email field should be a string
              description: "'email' must be a string and is required",
            },

            password: {
              bsonType: "string", // Password field should be a string also
              description: "'code' must be a string and is required",
            },

            providerID: {
              bsonType: ["string", "null"], // The field can either be string or null
              description:
                "'provider ID' must be either a string or null and is NOT required",
            },

            provider: {
              bsonType: "string",
              description:
                "'provider' must be a string and is required, and it can either be appUser of google",
            },

            phoneNumber: {
              bsonType: "string",
              description: "'Phone number' must be a string and is required",
            },

            fullName: {
              bsonType: "string",
              description: "'Full name' must be a string and is required",
            },

            dateJoined: {
              bsonType: "date",
              description:
                "'Date joined' must be a date object and is required",
            },

            profilePicture: {
              bsonType: ["string", "null"], // The field can either be string or null
              description:
                "'Profile picture' must be either a string or null and is NOT required",
            },

            // 'bag' holds the id of the products this user has added to their bag
            bag: {
              bsonType: "array",
              items: { bsonType: "string" },
              description:
                "'bag' must be an array of strings and is NOT required",
            },
          },
        },
      },
    });

    // Create a unique index on the email field. This ensures no two same values of the email field is saved
    await userCollection.createIndex({ email: 1 }, { unique: true });

    // Create the collection to store a products
    const productsCollection = await udohsDatabase.createCollection(
      "products",
      {
        validator: {
          $jsonSchema: {
            bsonType: "object", // NOTE: This means the collection will be an object

            title: "Products object validation",

            // State the required fields in the collection
            required: [
              "productOwnerID",
              "category",
              "country",
              "state",
              "currency",
              "amount",
              "title",
              "description",
              "photos",
              "dateAdded",
            ],

            // Define what each fields should contain
            properties: {
              productOwnerID: {
                bsonType: ["string", "objectId"], // This field should be a string or an objectid
                description:
                  "'productOwnerID' must be a string or objectid and is required",
              },

              category: {
                bsonType: "string", // This field should be a string also
                enum: [
                  "vehicle",
                  "phone",
                  "computer",
                  "homeAppliances",
                  "fashion",
                  "properties",
                  "others",
                ],
                description:
                  "'category' must only be one of the enum values and is required",
              },

              country: {
                bsonType: "string",
                description: "'country' must be a string and is required",
              },

              state: {
                bsonType: "string",
                description: "'state' must be a string and is required",
              },

              currency: {
                bsonType: "string",
                enum: ["8358", "36", "8364"],
                description:
                  "'currency' must be a string, must be a value from the enum and is required",
              },

              amount: {
                bsonType: "string",
                description: "'amount' must be a string and is required",
              },

              title: {
                bsonType: "string",
                description: "'title' must be a string and is required",
              },

              description: {
                bsonType: "string",
                description: "'description' must be a string and is required",
              },

              photos: {
                bsonType: "array",
                items: { bsonType: "string" },
                description:
                  "'photos' must be either an array of strings and is required",
              },

              dateAdded: {
                bsonType: "date",
                description:
                  "'Date added' must be a date object and is required",
              },
            },
          },
        },
      }
    );

    // Create a text index on the 'title' and 'description' fields, so that values in these fields can be searched
    await productsCollection.createIndex(
      [{ title: "text" }, { description: "text" }]
      // { default_language: "none" } // By default, mongodb search ignores stop words like 'from', 'the' etc. This will make sure those stop words are not ignored
    );

    // Create the collection to store the chat messages
    await udohsDatabase.createCollection("chatMessage", {
      validator: {
        $jsonSchema: {
          bsonType: "object", // NOTE: This means the collection will be an object

          title: "Chat message object validation",

          // State the required fields in the collection
          required: [
            "senderID",
            "receiverID",
            "productID",
            "message",
            "dateAndTime",
            "readByReceiver",
          ],

          properties: {
            senderID: {
              bsonType: "objectId",
              description:
                "'senderID' must be a mongodb Object ID and is required",
            },

            receiverID: {
              bsonType: "objectId",
              description:
                "'receiverID' must be a mongodb Object ID and is required",
            },

            productID: {
              bsonType: "objectId",
              description:
                "'productID' must be a mongodb Object ID and is required",
            },

            message: {
              bsonType: "string",
              description: "'message' must be a string and is required",
            },

            dateAndTime: {
              bsonType: "date",
              description:
                "'dateAndTime' must be a date object and is required",
            },

            readByReceiver: {
              bsonType: "bool",
              description: "'readByReceiver' must be a boolean and is required",
            },
          },
        },
      },
    });

    // Create the collection to store the chats between two users.
    const chats = await udohsDatabase.createCollection("chats", {
      validator: {
        $jsonSchema: {
          bsonType: "object", // NOTE: This means the collection will be an object

          title: "Chat object validation",

          // State the required fields in the collection
          required: [
            "chatPartner1",
            "chatPartner2",
            "productID",
            "messages",
            "lastMessageId",
          ],

          properties: {
            chatPartner1: {
              bsonType: "objectId",
              description:
                "'chatPartner1' must be a mongodb Object ID and is required",
            },

            chatPartner2: {
              bsonType: "objectId",
              description:
                "'chatPartner2' must be a mongodb Object ID and is required",
            },

            productID: {
              bsonType: "objectId",
              description:
                "'productID' must be a mongodb Object ID and is required",
            },

            messages: {
              bsonType: "array",
              items: { bsonType: "objectId" },
              description:
                "'messages' must be an array of mongodb Object IDs and is required",
            },

            // This is added, to avoid having to search through the list of messages, to look for the last message every time
            lastMessageId: {
              bsonType: ["objectId"], // This field should be an empty string or an objectid
              description:
                "'lastMessageId' must be a mongodb Object ID and is required",
            },
          },
        },
      },
    });

    // This will ensure that the same chatPartner1-chatPartner2 pair will NOT be allowed more than once
    // We created a compound index here (so, chatPartner1 and chatPartner2) will be looked up together
    // When we say "chatPartner1: 1", the 1 here, means the field should be indexed in ascending order. We can also use "chatPartner1: -1", where the -1 will mean descending order
    await chats.createIndex(
      { chatPartner1: 1, chatPartner2: 1 },
      { unique: true }
    );

    // Since we will be using the $or to look up the 'chatPartner1' and 'chatPartner2' fields separately (i.e, when deciding if a user is either a chatPartner1 OR chatPartner1)
    // we have to create index on the two fields separately, for faster lookup and performance benefits
    await chats.createIndex({ chatPartner1: 1 });
    await chats.createIndex({ chatPartner2: 1 });
  } catch (e) {
    console.log("Error creating collections", e);

    // If creating any collection caused an error, I don't want the server to start, so I throw this error
    throw new Error();
  }
};

export default createCollections;
