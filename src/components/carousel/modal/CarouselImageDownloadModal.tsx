import Modal from "components/ui/Modal/Modal";
import { useIntl } from "react-intl";

type CarouselImageDownloadModalProps = {
  onClose: () => void;
  imageToDownload: string;
};

const CarouselImageDownloadModal = ({ onClose, imageToDownload }: CarouselImageDownloadModalProps) => {
  const intl = useIntl();
  const handleDownload = () => {
    window.open(imageToDownload, "_blank");
    return onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={intl.formatMessage({ id: "questionTypes.blob" })}
      className="c-modal-form"
      actions={[
        { name: "common.download", onClick: handleDownload },
        { name: "common.cancel", variant: "secondary", onClick: onClose }
      ]}
    >
      <div className="border-2 border-solid border-neutral-400 rounded-lg flex items-center justify-center h-full">
        <img src={imageToDownload} alt="" className="h-full w-full object-contain" />
      </div>
    </Modal>
  );
};

export default CarouselImageDownloadModal;
