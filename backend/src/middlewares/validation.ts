import { body } from "express-validator";

export const validateEmail = body("email")
  .trim()
  .notEmpty()
  .escape() // Clean the data. (Changes html or scripts to string, to prevent XSS injection attacks)
  .isEmail()
  .normalizeEmail({
    gmail_remove_dots: false, // By default, any dot in an email will be removed. This prevents that
    gmail_remove_subaddress: false, // This was added so that in emails like 'udoh+test@gmail.com', the '+test' will be preserved. If not it will be removed
  })
  .withMessage("Please enter a valid email address.");

export const validatePassword = body("password")
  .trim()
  .notEmpty()
  .escape()
  .isLength({ min: 8 }) // Password must be a minimum of 8 characters
  .custom((value, { req }) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(value); // Returns true if the password meets the regex criteria, else it returns false. This regex requires at least one uppercase, one lowercase, one number, one special character and at least 8 characters
  })
  .withMessage("Password is invalid");
