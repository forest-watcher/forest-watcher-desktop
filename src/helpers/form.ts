export const disableEnterKey = (e: React.KeyboardEvent<HTMLInputElement | HTMLFormElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};
