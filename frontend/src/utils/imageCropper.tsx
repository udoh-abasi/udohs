import React, { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { ImageCropperProps } from "./tsInterface";

const ImageCropper: React.FC<ImageCropperProps> = ({
  setShowImageCropperInterface,
  imageToCrop,
  setImageOnInput,
  setCroppedImageAndCanvasOnParent,
  imageFormat,
  desiredWidth,
  desiredHeight,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  // This holds the cropped image, and displays it on the PREVIEW section
  const [croppedImage, setCroppedImage] = useState("");

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;

    // Access the cropped image data and do something with it
    const croppedCanvas = cropper
      ?.getCroppedCanvas({ width: desiredWidth, height: desiredHeight })
      .toDataURL(imageFormat);

    // Set the cropped image's data in a state
    if (croppedCanvas) {
      setCroppedImage(croppedCanvas);
    }
  };

  const handleZoomIn = () => {
    const cropper = cropperRef.current?.cropper;
    cropper?.zoom(0.1); // Adjust the zoom level as needed
  };

  const handleZoomOut = () => {
    const cropper = cropperRef.current?.cropper;
    cropper?.zoom(-0.1); // Adjust the zoom level as needed
  };

  // This function gets us the canvas which we will use to upload the image to the backend. It also sends the croppedImage, which will be save and displayed on the parent element (i.e 'Sell.tsx')
  const sendCroppedImageAndCanvasToParent = () => {
    const cropper = cropperRef.current?.cropper;

    // NOTE Here, we did not use '.toDataURL' method. Because e want to use '.toBlob' instead, when sending the image to the server
    const canvas = cropper?.getCroppedCanvas({
      width: desiredWidth,
      height: desiredHeight,
    });

    if (canvas) setCroppedImageAndCanvasOnParent(canvas, croppedImage);
  };

  return (
    <div className="fixed top-0 left-0 z-10 w-full h-full">
      <div className="fixed rounded-3xl z-10 pt-14 bg-black overflow-auto w-full h-auto max-h-full p-4 max-w-[800px] top-0 left-1/2 -translate-x-1/2 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
        <div className="flex items-center min-[800px]:items-start flex-col min-[800px]:flex-row min-[800px]:justify-center gap-8 ">
          <div>
            <Cropper
              ref={cropperRef}
              src={imageToCrop}
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "500px",
                maxHeight: "300px",
                overflow: "hidden",
              }}
              //aspectRatio={16 / 9} // Set the aspect ratio (optional)
              guides={false} // Show cropping guides inside the cropBox (optional)
              crop={handleCrop} // Callback function when cropping is done (optional)
              zoomOnTouch={false} // Prevent zooming in or out by pinching the image, on touch devices
              zoomOnWheel={false} // Prevent zooming in or out when the mouse is placed on the image and scrolled up or down
              viewMode={1} // Set view mode to restrict cropping to the specified aspect ratio
              aspectRatio={desiredWidth / desiredHeight} // Set aspect ratio. Aspect ratio is gotten by dividing the width by the height. So, if our image is 720x311, we used 2.32 as the aspect ratio
              autoCropArea={1} // Crop the entire image within the specified aspect
              dragMode="move" // This makes sure the image moves when dragged, instead of drawing a cropped area
              cropBoxResizable={false} // Prevents the user from resizing the cropBox. This ensures the cropped area is fixed
            />

            <div className="mt-4 flex justify-center gap-4 min-[500px]:gap-16 min-[500px]:text-lg font-bold">
              <button
                type="button"
                onClick={handleZoomIn}
                className="ring-2 ring-[#a1d06d] flex items-center px-4 py-1 rounded-lg hover:bg-[#81ba40] hover:text-black transition-all duration-300 ease-linear"
              >
                Zoom in <AiOutlineZoomIn className="ml-2" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="ring-2 ring-[#a1d06d] flex items-center px-4 py-1 rounded-lg hover:bg-[#81ba40] hover:text-black transition-all duration-300 ease-linear"
              >
                Zoom out <AiOutlineZoomOut className="ml-2" />
              </button>
            </div>
          </div>

          <div className="mt-4 min-[800px]:mt-0">
            <h2 className="uppercase text-2xl font-bold mb-2">Preview</h2>
            {croppedImage && (
              <img src={croppedImage} alt="Cropped" className="max-w-[150px]" />
            )}
          </div>
        </div>

        <div className="mt-16 flex gap-4 min-[500px]:gap-16 justify-center">
          <button
            type="button"
            onClick={() => {
              setShowImageCropperInterface(); // Turn off the picture cropping interface
              setImageOnInput(); // Set the image in the input field to an empty string. This was added as a fix, so that if the same picture is selected twice in a row, the picture cropping interface will still be triggered
              sendCroppedImageAndCanvasToParent();
            }}
            className="px-4 w-[150px] min-[500px]:text-xl uppercase font-bold rounded-xl rounded-tl-xl py-2 ring-4 ring-[#81ba40] hover:bg-[#81ba40] hover:text-black transition-all duration-300 ease-linear shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => {
              setShowImageCropperInterface();
              setImageOnInput();
            }}
            className="px-4 font-bold rounded-xl rounded-tl-xl py-2 ring-2 ring-red-500 hover:bg-red-500 hover:text-black transition-all duration-300 ease-linear shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
