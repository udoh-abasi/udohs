// This function generates 6 random numbers, that we will use to verify a user's email when checking out as guest
const getSixRandomNumbers = () => {
  let allNumb = "";
  for (let index = 0; index < 6; index++) {
    const randomNumber = Math.floor(Math.random() * 10);
    allNumb = allNumb + randomNumber;
  }

  return allNumb;
};

export default getSixRandomNumbers;
