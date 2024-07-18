import { useState } from "react";
import ImageCropper from "./imageCropper";
import { AiFillWarning } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import Loader from "./loader";
import { hideForm } from "./showOrHideSignUpAndRegisterForms";
import { FaRegWindowClose } from "react-icons/fa";

const EditProfile = () => {
  // NOTE: This is a hack to ensure that the <input type=file/> responsible for collecting image is always empty. This will make the react-cropper interface show up anytime the user selects a picture.
  // If this is not set to an empty string (after the image has been edited), then if the user selects the same picture twice (back-to-back), the interface will not show up the second time
  const [imageOnInput, setImageOnInput] = useState("");

  // NOTE: This holds the image Format, which will be sent to 'react-cropper'
  const [imageFormat, setImageFormat] = useState("");

  // NOTE: This holds the image to be sent to 'react-cropper', to crop
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // The 'canvas' and the 'croppedImage' will be stored here. We will display the 'croppedImage' on the website and use the 'canvas' to send the image to the backend.
  // NOTE: We also have the 'id', which is required since we will be using 'ReactSortable' to easily click and drag-and-drop images to change the arrangement
  const [croppedImageAndCanvas, setCroppedImageAndCanvas] = useState<{
    croppedImage: string;
    canvas: HTMLCanvasElement;
  }>();

  const [showImageCropperInterface, setShowImageCropperInterface] =
    useState(false);

  const showImage = () => {
    if (croppedImageAndCanvas?.croppedImage) {
      return croppedImageAndCanvas.croppedImage;
    }
    // else if (user.profile_pic) {
    //   return profilePicURL + `${user.profile_pic}`;
    // }
    else {
      return "/Profile_Image_Placeholder-small.jpg";
    }
  };

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState(false);

  return (
    <div className="grid place-items-center h-screen overflow-auto">
      <section
        className="relative p-4 bg-[#c9a998] h-fit w-full rounded-xl max-w-[615px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();

            setEditProfileError(false);
            setEditProfileLoading(false);

            // editProfile();
          }}
        >
          <div className="flex justify-center">
            <picture className="w-[150px] h-[150px] rounded-full overflow-hidden shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <img alt="" src={showImage()} />
            </picture>
          </div>

          <div>
            <input
              type="file"
              id="changeProfilePicture"
              accept="image/*"
              className="max-w-full hidden"
              multiple={false}
              value={imageOnInput}
              onChange={(e) => {
                // Check if a file was provided, then check if the file is an image file
                if (
                  e.target.files?.length &&
                  e.target.files[0].type.startsWith("image/")
                ) {
                  setImageFormat(e.target.files[0].type);
                  setImageToCrop(URL.createObjectURL(e.target.files[0]));
                  setShowImageCropperInterface(true);
                } else {
                  console.log("Invalid file provided");
                }
              }}
            />
            <label
              htmlFor="changeProfilePicture"
              className="block mt-3 underline decoration-blue-600 text-center text-black font-bold cursor-pointer"
            >
              Change picture
            </label>
          </div>

          {showImageCropperInterface && (
            <ImageCropper
              // NOTE: This will be the height of the final image (after cropping) that 'react-cropper' will give us to save to the backend. So here, the final image we will be saving in the backend will be 780px in height
              desiredHeight={300}
              //
              // NOTE: This will be the width of the final image (after cropping) that 'react-cropper' will give us to save to the backend. So here, the final image we will be saving in the backend will be 780px in height
              desiredWidth={300}
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
                setCroppedImageAndCanvas({ canvas, croppedImage });
              }}
            />
          )}

          <div className="flex flex-col-reverse mb-8 relative mt-16 text-black">
            <input
              type="text"
              required
              placeholder=" "
              id="fullName"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:ring-gray-600 disabled:text-gray-400"
            />

            <label
              htmlFor="fullName"
              className="cursor-text font-bold text-sm p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-70%] peer-focus:translate-y-[0] top-[-70%] transition-all duration-500 ease-linear"
            >
              Full name&nbsp;<span className="text-red-500">&#42;</span>
            </label>
          </div>

          <div className="flex flex-col-reverse mb-4 relative mt-16 text-black">
            <input
              type="number"
              maxLength={13}
              required
              placeholder=" "
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:ring-gray-600 disabled:text-gray-400"
            />

            <label
              htmlFor="phoneNumber"
              className="cursor-text font-bold text-sm p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-70%] peer-focus:translate-y-[0] top-[-70%] transition-all duration-500 ease-linear"
            >
              Phone Number&nbsp;
              <span className="text-red-500">&#42;</span>
            </label>
          </div>

          {editProfileError && (
            <p className="text-red-500 text-sm text-center mb-4">
              <AiFillWarning className="inline text-lg mr-1" />
              Something went wrong
            </p>
          )}

          <div className="flex justify-center mb-8 mt-12">
            <button
              type="submit"
              disabled={editProfileLoading}
              className="px-4 flex justify-center items-center w-[200px] uppercase font-bold rounded-br-xl rounded-tl-xl py-2 ring-4 ring-[#a1d06d] hover:bg-[#a1d06d] hover:text-black transition-all duration-300 ease-linear shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
            >
              {editProfileLoading ? (
                <Loader />
              ) : (
                <span className="flex justify-center">
                  Save <BiSave className="text-xl ml-2 inline" />
                </span>
              )}
            </button>
          </div>

          <button
            aria-label="close"
            type="button"
            title="close"
            className="text-4xl absolute top-2 right-3 text-black cursor-pointer"
            onClick={() => {
              hideForm("#editProfile");
            }}
          >
            <FaRegWindowClose />
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditProfile;
