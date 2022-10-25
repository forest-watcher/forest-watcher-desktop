import Modal from "components/ui/Modal/Modal";

type CarouselImageDownloadModalProps = {
  onClose: () => void;
  imageToDownload: string;
};

const CarouselImageDownloadModal = ({ onClose, imageToDownload }: CarouselImageDownloadModalProps) => {
  const handleDownload = () => {
    window.open(imageToDownload, "_blank");
    return onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={"Images"}
      className="c-modal-form"
      actions={[
        { name: "Download", onClick: handleDownload },
        { name: "common.cancel", variant: "secondary", onClick: onClose }
      ]}
    >
      <div className="border-2 border-solid border-gray-400 rounded-lg flex items-center justify-center h-full py-4">
        <img src={imageToDownload} alt="" className="h-full" />
      </div>
    </Modal>
  );
};

export default CarouselImageDownloadModal;
