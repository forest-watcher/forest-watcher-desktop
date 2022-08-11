export const download = (path: string, filename = "") => {
  // Create a new link
  const anchor = document.createElement("a");
  anchor.href = path;
  anchor.download = filename;

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);
};

export const copyToClipboard = async (path: string) => {
  try {
    await navigator.clipboard.writeText(path);
  } catch (err) {
    console.log("could not copy to clipboard", err);
  }
};

export const openMailClient = async (subject = "", emailBody = "") => {
  // Correctly format special characters
  const mailToLink = `mailto:?body=${encodeURIComponent(emailBody).replace(
    /%0A/g,
    "%0D%0A"
  )}&subject=${encodeURIComponent(subject).replace(/%0A/g, "%0D%0A")}`;

  const anchor = document.createElement("a");
  anchor.href = mailToLink;
  anchor.target = "_blank";

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);
};
