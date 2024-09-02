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
          },
        },
      },
    });

    // Create a unique index on the email field. This ensures no two same values of the email field is saved
    await userCollection.createIndex({ email: 1 }, { unique: true });
  } catch (e) {
    console.log("Error creating collections", e);
  }

  // Create the collection to store a products
  const productsCollection = await udohsDatabase.createCollection("products", {
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
              "'photos' must be either an array of strings of strings and is required",
          },

          dateAdded: {
            bsonType: "date",
            description: "'Date added' must be a date object and is required",
          },
        },
      },
    },
  });

  // Create a text index on the 'title' and 'description' fields, so that values in these fields can be searched
  await productsCollection.createIndex(
    [{ title: "text" }, { description: "text" }]
    // { default_language: "none" } // By default, mongodb search ignores stop words like 'from', 'the' etc. This will make sure those stop words are not ignored
  );
};

export default createCollections;
