import classNames from "classnames";
import Icon from "components/extensive/Icon";
import Button from "components/ui/Button/Button";
import Modal from "components/ui/Modal/Modal";
import Toggle from "components/ui/Toggle/Toggle";
import { copyToClipboard, download } from "helpers/exports";
import ReportResponse, { ReportResponseProps } from "pages/reports/report/components/ReportResponse";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";

const AudioResponse = ({ response, childQuestions, handleVisibilityChange }: ReportResponseProps) => {
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [isAudioPublic, setIsAudioPublic] = useState(
    //@ts-ignore
    response?.isPublic || false
  );
  const intl = useIntl();

  //@ts-expect-error swagger schema is not accurate
  const originalUrl = response?.originalUrl;
  //@ts-expect-error swagger schema is not accurate
  const privateUrl = typeof response === "object" ? (response?.url as string) : response;
  //@ts-expect-error swagger schema is not accurate
  const fileUrl = typeof response === "object" ? (response?.originalUrl as string) : response;
  const filename = fileUrl?.split("/").pop() || "";

  const handleShare = () => {
    if (isAudioPublic) {
      copyToClipboard(originalUrl)
        .then(() => {
          toastr.success(intl.formatMessage({ id: "common.share.toast.success" }), "");
        })
        .catch(() => {
          toastr.error(intl.formatMessage({ id: "common.error" }), "");
        });
    } else {
      toastr.error(intl.formatMessage({ id: "common.share.toast.error" }), "");
    }
  };

  return (
    <>
      {childQuestions?.map(
        child =>
          child.value && (
            <ReportResponse
              key={child.name}
              response={child.value}
              type="text"
              question=""
              handleVisibilityChange={handleVisibilityChange}
            />
          )
      )}
      <div className="flex justify-between items-center">
        {filename && (
          <button
            onClick={() => {
              setAudioModalOpen(true);
            }}
            className={classNames(
              "bg-primary-400 px-4 py-[9px] rounded-md border border-solid border-primary-500 text-neutral-700 text-base",
              Boolean(childQuestions?.find(item => item.value))
            )}
          >
            {filename}
          </button>
        )}
        <div className="flex gap-2.5">
          <Button onClick={handleShare} aria-label={intl.formatMessage({ id: "common.share" })} isIcon>
            <Icon name="link" size={36} />
          </Button>
          <Button
            onClick={() => download(privateUrl)}
            aria-label={intl.formatMessage({ id: "common.download" })}
            isIcon
          >
            <Icon name="download" size={36} />
          </Button>
        </div>
      </div>
      <hr className="border-neutral-600/10 -mx-6 my-6" />
      <div className="space-y-3">
        <Toggle
          label={intl.formatMessage({ id: "common.visibilityStatus.title" })}
          value={!originalUrl ? true : isAudioPublic} // If there is no originalUrl, the audio is always public
          disabled={!originalUrl}
          onChange={e => {
            setIsAudioPublic(e);
            handleVisibilityChange(e, originalUrl);
          }}
        />
        <p className="text">
          <FormattedMessage id="common.visibilityStatus.description" />
        </p>
      </div>
      <Modal
        isOpen={audioModalOpen}
        title="audio.play"
        onClose={() => setAudioModalOpen(false)}
        actions={[
          { name: "common.download", onClick: () => download(privateUrl || "") },
          { name: "common.close", variant: "secondary", onClick: () => setAudioModalOpen(false) }
        ]}
      >
        <div className="w-full h-full flex justify-center align-middle">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={fileUrl || ""} autoPlay controls />
        </div>
      </Modal>
    </>
  );
};

export default AudioResponse;
