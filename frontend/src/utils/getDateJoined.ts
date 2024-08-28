// This function returns the month and year, taking the 'Date' as an argument
export const getDateJoined = (date: Date | undefined) => {
  if (date) {
    const theDateObject = new Date(date);

    const month = theDateObject.toLocaleString("en-US", { month: "long" });
    const year = theDateObject.getFullYear();

    return `${month} ${year}`;
  }
};
