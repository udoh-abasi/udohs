import { useEffect, useState } from "react";
import CountryAndState from "../utils/countryState";
import Select from "react-select";
import {
  categoryOptionsInterface,
  currencyOptionsInterface,
} from "../utils/tsInterface";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import ImageCropper from "../utils/imageCropper";
import { ReactSortable } from "react-sortablejs";
import uuid4 from "uuid4";
import { AiFillWarning } from "react-icons/ai";

const Sell = () => {
  // This holds the available category options the user can select from. Default is null
  const [category, setCategory] = useState<categoryOptionsInterface | null>(
    null
  );

  // When a user selects a value from a category, the value is stored here
  const [categoryValue, setCategoryValue] = useState("");

  // This holds the available currency options the user can select from. Default is null
  const [currency, setCurrency] = useState<currencyOptionsInterface | null>(
    null
  );

  // When a user selects a value from a currency, the value is stored here
  const [currencyValue, setCurrencyValue] = useState("");

  // When a user selects a country from the child component called 'CountryAndState' (which is below), the selected country is stored here
  const [country, setCountry] = useState("");

  // When a user selects a state from the child component called 'CountryAndState' (which is below), the selected state is stored here
  const [state, setState] = useState("");

  // This is the amount that will be sent to the database
  const [amount, setAmount] = useState<string>("");

  // NOTE: This is a hack to ensure that the <input type=file/> responsible for collecting image is always empty. This will make the react-cropper interface show up anytime the user selects a picture.
  // If this is not set to an empty string (after the image has been edited), then if the user selects the same picture twice (back-to-back), the interface will not show up the second time
  const [imageOnInput, setImageOnInput] = useState("");

  // NOTE: This holds the image Format, which will be sent to 'react-cropper'
  const [imageFormat, setImageFormat] = useState("");

  // NOTE: This holds the image to be sent to 'react-cropper', to crop
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // The 'canvas' and the 'croppedImage' will be stored here. We will display the 'croppedImage' on the website and use the 'canvas' to send the image to the backend.
  // NOTE: We also have the 'id', which is required since we will be using 'ReactSortable' to easily click and drag-and-drop images to change the arrangement
  const [croppedImageAndCanvas, setCroppedImageAndCanvas] = useState<
    { croppedImage: string; canvas: HTMLCanvasElement; id: string }[]
  >([]);

  const [showImageCropperInterface, setShowImageCropperInterface] =
    useState(false);

  useEffect(() => {
    console.log(country);
    console.log(state);
    console.log(categoryValue);
    console.log(currencyValue);
    console.log(amount);
  }, [state, country, categoryValue, currencyValue, amount]);

  // These are the options that will be used to populate the category's <Select>
  const categoryOptions: categoryOptionsInterface[] = [
    { value: "vehicle", label: "Vehicles" },
    { value: "phone", label: "Mobile Phone" },
    { value: "computer", label: "Computer & Accessories" },
    { value: "homeAppliances", label: "Home appliances" },
    { value: "fashion", label: "Fashion" },
    { value: "properties", label: "Properties" },
    { value: "others", label: "Others" },
  ];

  // These are the options that will be used to populate the currency's <Select>
  const currencyOptions: currencyOptionsInterface[] = [
    { value: "&#8358;", label: <span>&#8358;</span> },
    { value: "&#36;", label: <span>&#36;</span> },
    { value: "&#8364;", label: <span>&#8364;</span> },
  ];

  // Format the amount field, to add commas at appropriate places
  const formatValue = (value: string) => {
    if (value) {
      const regex = /[^0-9]/g; // Regex to accept just numbers

      const newString = value.replace(regex, ""); // Ensures only numbers are accepted in the field

      // Check if there is still a number, after the formatting
      if (newString) {
        return Number(newString).toLocaleString(undefined, {}); // Transform the rawText to a number, then format it with 'toLocaleString' to add numbers at the appropriate place
      }
    }
    return ""; // This will be returned if the user has not typed a number yet (maybe they are just typing text)
  };

  // NOTE: This useEffect just makes the <body> to NOT be scrollable when the crop image interface is open
  useEffect(() => {
    showImageCropperInterface
      ? document.querySelector("body")?.classList.add("menuOpen") // Make the <body> unscrollable
      : document.querySelector("body")?.classList.remove("menuOpen"); // Make the <body> scrollable
  }, [showImageCropperInterface]);

  // This will be true, if the user has already added the image, and is trying to add the same image again
  const [duplicateImage, setDuplicateImage] = useState(false);

  // NOTE: When a user adds images for a product, they can also remove some images. This function runs when the button is clicked to remove an image
  const removeImage = (theImage: string) => {
    // Just reset this if it is true
    setDuplicateImage(false);

    // Filter the 'croppedImageAndCanvas' and drop the one to be removed
    const filteredResult = croppedImageAndCanvas.filter(
      (item) => item.croppedImage != theImage
    );

    // Update the croppedImageAndCanvas state
    setCroppedImageAndCanvas([...filteredResult]);
  };

  // NOTE: This sets the croppedImage and the canvas from react-cropper, so we can use the croppedImage to show the image on the site, for the user to see, and then use the canvas to upload the image to the server
  // NOTE: We also added 'id' field, which we used uuid4. It is mandatory to add an id field, for 'ReactSortable' to work perfectly
  const runSetCroppedImageAndCanvas = (
    canvas: HTMLCanvasElement,
    croppedImage: string
  ) => {
    const imageAlreadyExist = croppedImageAndCanvas.some(
      (eachValue) => eachValue.croppedImage === croppedImage
    );

    if (imageAlreadyExist) {
      setDuplicateImage(true);
    } else {
      setCroppedImageAndCanvas([
        ...croppedImageAndCanvas,
        { id: uuid4(), croppedImage, canvas },
      ]);
    }
  };

  return (
    <main className="min-h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="p-4 min-[550px]:p-8 my-8 max-w-[550px] mx-auto rounded-2xl bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
      >
        <div className="text-black mb-8">
          <label className="text-white text-xl font-bold" htmlFor="category">
            Category
          </label>

          <Select
            id="category"
            instanceId="category"
            options={categoryOptions}
            required
            isSearchable
            value={category}
            onChange={(option) => {
              // NOTE: I used this if-else block to avoid TS errors, which does not allow accessing 'option.label', as 'option' may be null
              if (option) {
                setCategory(option);
                setCategoryValue(option.label);
              } else {
                setCategoryValue("");
                setCategory(null);
              }
            }}
            placeholder="Select a category..."
          />
        </div>

        <div className="mb-8 text-black">
          <label
            className="text-white text-xl font-bold"
            htmlFor="selectboxForCountry"
          >
            Location
          </label>

          <div>
            <CountryAndState
              setParentCountry={setCountry}
              setParentState={setState}
            />
          </div>
        </div>

        <div className="text-black mb-8">
          <label className="text-white text-xl font-bold" htmlFor="currency">
            Price
          </label>

          <div className="flex gap-2">
            <Select
              id="currency"
              instanceId="currency"
              options={currencyOptions}
              required
              value={currency}
              onChange={(option) => {
                if (option) {
                  setCurrency(option);
                  setCurrencyValue(option.value);
                } else {
                  setCurrencyValue("");
                  setCurrency(null);
                }
              }}
              placeholder="Currency"
              className="min-w-fit"
            />

            <input
              type="text"
              aria-label="amount"
              placeholder="Amount..."
              required
              className="w-full p-1 rounded-lg"
              value={amount}
              onChange={(e) => {
                setAmount(formatValue(e.target.value));
              }}
            />
          </div>
        </div>

        <div className="mt-8 text-black">
          <label htmlFor="title" className="text-white text-xl font-bold block">
            Title
          </label>

          <input
            type="text"
            id="title"
            required
            className="block h-[37px] w-full p-1 rounded-lg"
          />
        </div>

        <div className="mt-8 text-black">
          <label
            htmlFor="description"
            className="text-white text-xl font-bold block"
          >
            Description
          </label>

          <textarea
            id="description"
            required
            className="w-full h-40 p-1 rounded-lg resize-none"
          ></textarea>
        </div>

        <div className="mt-8">
          <p className="text-white text-xl font-bold block">Add Photo</p>

          <p className="mt-3 font-bold text-black">
            Add at least 1 photo{" "}
            <span className="italic text-sm block -mt-2">
              (preferred image dimension is 1080 X 780)
            </span>
          </p>

          <p className="mt-2 text-black font-bold text-sm">
            <span>The first photo will be used as the title photo.</span> You
            can change the order of photos: just grab your photos and drag.
          </p>

          <div className="max-w-[300px]">
            <input
              type="file"
              id="addImage"
              accept="image/*"
              className="max-w-full hidden"
              multiple={false}
              value={imageOnInput}
              onChange={(e) => {
                // Just reset this if it is true
                setDuplicateImage(false);

                // Check if a file was provided, then check if the file is an image file
                if (
                  e.target.files?.length &&
                  e.target.files[0].type.startsWith("image/")
                ) {
                  setImageFormat(e.target.files[0].type);
                  setImageToCrop(URL.createObjectURL(e.target.files[0])); // NOTE: We set this to a string, bcoz 'react-cropper' expects the image to be a string
                  setShowImageCropperInterface(true);
                } else {
                  console.log("Invalid file provided");
                }
              }}
            />
            <label
              htmlFor="addImage"
              className="flex justify-center items-center gap-2 text-xl mt-3 cursor-pointer bg-[rgba(161,208,109,.7)] hover:bg-[rgba(161,208,109,1)]  py-2 rounded-md shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
            >
              Add photo <IoIosAddCircle />
            </label>
          </div>
        </div>

        {showImageCropperInterface && (
          <ImageCropper
            // NOTE: This will be the height of the final image (after cropping) that 'react-cropper' will give us to save to the backend. So here, the final image we will be saving in the backend will be 780px in height
            desiredHeight={780}
            //
            // NOTE: This will be the width of the final image (after cropping) that 'react-cropper' will give us to save to the backend. So here, the final image we will be saving in the backend will be 780px in height
            desiredWidth={1040}
            //
            // NOTE: This is the format of the image. If we do not use the same image format as the original image, the final image (after cropping) will not look good
            imageFormat={imageFormat}
            //
            // NOTE: This hides the react-cropper interface
            setShowImageCropperInterface={() =>
              setShowImageCropperInterface(false)
            }
            //
            // NOTE: This is the image to be cropped (sent as a string to 'react-cropper')
            imageToCrop={imageToCrop}
            //
            // NOTE: This is a hack to ensure that the <input type=file/> responsible for collecting image is always empty. This will make the react-cropper interface show up anytime the user selects a picture.
            // If this is not done, then if the user selects the same picture twice (back-to-back), the interface will not show up the second time
            setImageOnInput={() => setImageOnInput("")}
            //

            // NOTE: This sets the croppedImage and the canvas from react-cropper
            setCroppedImageAndCanvasOnParent={(canvas, croppedImage) => {
              runSetCroppedImageAndCanvas(canvas, croppedImage);
            }}
          />
        )}

        <div className="mt-4 flex gap-3 flex-wrap">
          <ReactSortable // NOTE: When you are in development, touching and dragging the element will NOT move them, but when you deploy the code, touching and dragging will work
            // NOTE: This takes a list of objects. Note that the objects must have an 'id', which should be unique, also, do NOT use 'index' as the id, if not 'ReactSortable' will NOT work
            list={croppedImageAndCanvas}
            // NOTE: This is set to the setState
            setList={setCroppedImageAndCanvas}
            // Then pass in the classes
            className="mt-4 flex gap-3 flex-wrap"
          >
            {croppedImageAndCanvas.length ? (
              <>
                {croppedImageAndCanvas.map((eachCroppedImageAndCanvas) => (
                  <div className="relative" key={eachCroppedImageAndCanvas.id}>
                    <img
                      src={eachCroppedImageAndCanvas.croppedImage}
                      alt="Cropped"
                      tabIndex={0}
                      onClick={(e) => {
                        (e.target as HTMLImageElement).focus(); // NOTE: we need to tell TypeScript that 'e.target' is an Image element, if not, we will get error that "Property 'focus' does not exist on type 'EventTarget'"
                      }}
                      onTouchEnd={(e) => {
                        // NOTE: On touch screen, the 'onClick' event does not work well on images, so we use the 'onTouchEnd' event
                        (e.target as HTMLImageElement).focus(); // NOTE: we need to tell TypeScript that 'e.target' is an Image element, if not, we will get error that "Property 'focus' does not exist on type 'EventTarget'"
                      }}
                      className="max-w-[130px] inline mr-2 mt-2 p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                    />

                    <button
                      type="button"
                      className="absolute top-2 left-0 bg-black opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-focus:opacity-100 peer-focus-within:opacity-100"
                      aria-label="Remove Photo"
                      title="Remove Photo"
                      onClick={() => {
                        removeImage(eachCroppedImageAndCanvas.croppedImage);
                      }}
                      //
                      // NOTE: On touch screen, the 'onClick' event does not work well, so we use the 'onTouchEnd' event, an provided the same function
                      onTouchEnd={() => {
                        removeImage(eachCroppedImageAndCanvas.croppedImage);
                      }}
                    >
                      <IoIosCloseCircle className="text-2xl" />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
          </ReactSortable>

          {duplicateImage ? (
            <p className="mt-2 text-red-500 font-bold italic text-sm flex items-center">
              <AiFillWarning className="text-2xl" /> Image already added
            </p>
          ) : (
            <></>
          )}
        </div>

        <div className="mb-8 mt-16">
          <button
            type="submit"
            onClick={() => {
              // Just reset this if it is true
              setDuplicateImage(false);
            }}
            className="block text-2xl rounded-lg w-full hover:ring-2 ring-white text-white px-4 py-2 uppercase font-bold shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
          >
            Post
          </button>
        </div>
      </form>
    </main>
  );
};

export default Sell;
