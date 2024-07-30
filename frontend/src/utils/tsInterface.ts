// This interface is used on the file 'Sell.tsx', to define the options of the category and currency's <select>
export interface categoryOptionsInterface {
  value: string;
  label: string;
}

// This interface is used on the file 'Sell.tsx', to define the options of the category and currency's <select>
export interface currencyOptionsInterface {
  value: string;
  label: string | React.JSX.Element;
}

// This is used on the 'countryState.tsx' to define the props of the JSX
export interface selectOptions {
  value: string | undefined;
  label: string | undefined;
}

// This is the expected response from the backend, when we fetch the state and country values
interface serverResponse {
  id: number;
  name: string;
  iso2: string;
}

// This is used on the 'countryState.tsx' to define the expected response from the backend (when we fetch the 'country' and 'state')
export type theServerResponse = Partial<serverResponse>;

// NOTE: PROPS

// This is used on the 'countryState.tsx' to define the props
export interface CountryAndStateProps {
  setParentCountry: (country: string) => void;
  setParentState: (state: string) => void;
}

// This is used on the 'sign_up.tsx' to define the props
export interface signUpProps {
  hideSignUpForm: () => void;
  showSignInForm: () => void;
}

// This is used on the 'sign_in.tsx' to define the props
export interface signInProps {
  hideSignInForm: () => void;
  showSignUpForm: () => void;
  showSForgotPasswordForm: () => void;
}

// This is used on the 'forgotPassword.tsx' to define the props
export interface ForgotPasswordProps {
  hideForgotPasswordForm: () => void;
  showSignUpForm: () => void;
  showSignInForm: () => void;
}

// This is used on the 'imageCropper.tsx' to define the props
export interface ImageCropperProps {
  setShowImageCropperInterface: () => void;
  setImageOnInput: () => void;
  setCroppedImageAndCanvasOnParent: (
    canvas: HTMLCanvasElement,
    croppedImage: string
  ) => void;

  // NOTE: Any image that we get using <input type="file" /> will be one of this types
  imageToCrop: string;
  imageFormat: string;
  desiredWidth: number;
  desiredHeight: number;
}

// This is the user interface
export interface User {
  _id?: string;
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  dateJoined: Date;
  profilePicture?: string | null;
}
