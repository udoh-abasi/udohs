import { Db, MongoClient, ServerApiVersion } from "mongodb";

// This will hold the database, which we will use to create collections. Notice, a database is of type 'Db'.
let udohsDatabase: Db;

const connectToMongo = async () => {
  try {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
      serverApi: {
        version: ServerApiVersion.v1,
        // Set this to false, if not, we will get an error that says 'text indexes cannot be created with apiStrict: true'
        strict: false,
        deprecationErrors: true,
      },
    });

    // Connect to the server
    await mongoClient.connect();

    // Select the database. If it does not exist, one will be created
    udohsDatabase = mongoClient.db("udohsDB");

    console.log("Successfully connected to MongoDB");
  } catch (e) {
    console.log("Could not connect to MongoDB", e);
  }
};

export { udohsDatabase, connectToMongo };
