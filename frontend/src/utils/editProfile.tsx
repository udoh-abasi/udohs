import { useState } from "react";
import ImageCropper from "./imageCropper";
import { AiFillWarning } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import Loader from "./loader";
import { hideForm } from "./showOrHideSignUpAndRegisterForms";
import { FaRegWindowClose } from "react-icons/fa";
import { userAction } from "../reduxFiles/actions";
import axiosClient, { profilePictureURL } from "./axiosSetup";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../reduxFiles/selectors";

const EditProfile = () => {
  const theUserSelector = useSelector(userSelector);
  const user = theUserSelector.userData;

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

  // This function runs to display the right image on the edit image field
  const showImage = () => {
    if (croppedImageAndCanvas?.croppedImage) {
      return croppedImageAndCanvas.croppedImage;
    } else if (user?.profilePicture) {
      return `${profilePictureURL}/${user.profilePicture}`;
    } else {
      return "/Profile_Image_Placeholder-small.jpg";
    }
  };

  const [fullName, setFullName] = useState(user?.fullName ? user.fullName : "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phoneNumber ? user.phoneNumber : ""
  );

  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState(false);

  const dispatch = useDispatch();

  // This function runs to edit the user's profile
  const editProfile = async () => {
    setEditProfileLoading(true);
    setEditProfileError(false);

    // If the user want to edit their profile image
    if (croppedImageAndCanvas?.canvas) {
      croppedImageAndCanvas.canvas.toBlob(async (blob) => {
        const formData = new FormData();

        const currentDateTime = new Date().toISOString().replace(/:/g, "-"); // Get current date and time and append to the name of the image. This is a fix for a bug, bcoz the backend deletes the old image and saves the new one. Which will give the old and new image the same name, therefore the frontend will not re-render that new image until you refresh bcoz its the same name

        const slashIndex = imageFormat.indexOf("/"); // Since the extension will be in the format 'image/wep' or 'image/jpg', we get the index of the slash, and then slice from there
        const imageExtension = imageFormat.slice(slashIndex + 1); // So, this will return something like 'web', 'jpg' (taking out everything before slash (/))

        // So, the name of the image will be in the form 'udoh_2023-09-14T03:14:05.752Z.webp'
        if (blob) {
          formData.append(
            "profilePic", // The first argument is the name of the field (which the backend will use to get the image)

            blob, // The second argument is the image

            // NOTE: This third argument is the filename
            `${fullName.replace(
              /:/g,
              "-"
            )}_${currentDateTime}.${imageExtension}`
          );
        }

        formData.append("fullName", fullName);
        formData.append("phoneNumber", phoneNumber);

        try {
          const response = await axiosClient.post("/api/edituser", formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          });
          if (response.status === 200) {
            const data = response.data;
            dispatch(userAction({ userData: data }));
            hideForm("#editProfile");
          }
          setEditProfileLoading(false);
        } catch (error) {
          console.error("Error uploading cropped image:", error);
          setEditProfileError(true);
          setEditProfileLoading(false);
        }
      }, imageFormat); // Set format here to the original image's format otherwise, the cropped image will be larger in size (in mb or kb) than the original image
    } else {
      // So, if the user does not want to change their profile pic, this will run this instead
      try {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("phoneNumber", phoneNumber);

        const response = await axiosClient.post("/api/edituser", formData);
        if (response.status === 200) {
          const data = response.data;
          dispatch(userAction({ userData: data }));
          hideForm("#editProfile");
        }
        setEditProfileLoading(false);
      } catch (error) {
        console.error("Error sending without image:", error);
        setEditProfileError(true);
        setEditProfileLoading(false);
      }
    }
  };

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

            editProfile();
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
                  // console.log("Invalid file provided");
                }
              }}
            />
            <label
              htmlFor="changeProfilePicture"
              className="block mt-3 underline decoration-blue-600 text-center text-black font-bold cursor-pointer"
            >
              Change picture
            </label>
            <p className="italic font-bold text-xs text-center text-black">
              <span className="block">
                (Preferred image dimension is 300 X 300.
              </span>
              <span className="block">Maximum of 10MB)</span>
            </p>
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
