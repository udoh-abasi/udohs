const showForm = (formID: string): void => {
  const form_wrapper = document.querySelector(formID);

  form_wrapper?.classList.remove("hidden");

  document.querySelector("body")?.classList.add("menuOpen");

  setTimeout(() => {
    form_wrapper?.classList.remove("top-[1200px]");

    form_wrapper?.classList.add("top-0");
  }, 0.05);
};

const hideForm = (formID: string): void => {
  const form_wrapper = document.querySelector(formID);
  form_wrapper?.classList.remove("top-0");

  form_wrapper?.classList.add("top-[1200px]");

  document.querySelector("body")?.classList.remove("menuOpen");

  setTimeout(() => {
    form_wrapper?.classList.add("hidden");
  }, 500);
};

export { showForm, hideForm };
