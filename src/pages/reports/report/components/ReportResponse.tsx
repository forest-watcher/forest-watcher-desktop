import classNames from "classnames";
import Carousel from "components/carousel/Carousel";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import HeaderCard from "components/ui/Card/HeaderCard";
import Modal from "components/ui/Modal/Modal";
import Toggle from "components/ui/Toggle/Toggle";
import { AnswerResponse } from "generated/forms/formsSchemas";
import { download } from "helpers/exports";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface IReportResponse {
  question: string;
  response: string | null;
  type: string;
}

export interface ReportResponseProps extends IReportResponse {
  childQuestions?: AnswerResponse[];
  handleVisibilityChange: (isPublic: boolean, url: string) => void;
}

const Response = (props: ReportResponseProps) => {
  const { response, type, childQuestions, handleVisibilityChange } = props;
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [isAudioPublic, setIsAudioPublic] = useState(
    //@ts-ignore
    response?.isPublic || false
  );
  const intl = useIntl();

  switch (type) {
    case "audio":
      //@ts-expect-error swagger schema is not accurate
      const originalUrl = response?.originalUrl;
      //@ts-expect-error swagger schema is not accurate
      const fileUrl = typeof response === "object" ? (response?.originalUrl as string) : response;
      const filename = fileUrl?.split("/").pop() || "";
      return (
        <>
          {childQuestions?.map(
            child =>
              child.value && (
                <Response
                  key={child.name}
                  response={child.value}
                  type="text"
                  question=""
                  handleVisibilityChange={handleVisibilityChange}
                />
              )
          )}
          {filename && (
            <button
              onClick={() => {
                setAudioModalOpen(true);
              }}
              className={classNames(
                "bg-primary-400 px-4 py-[9px] rounded-md border border-solid border-primary-500 text-neutral-700 text-base",
                Boolean(childQuestions?.find(item => item.value)) && "mt-6"
              )}
            >
              {filename}
            </button>
          )}
          <hr className="border-neutral-500-10 -mx-6 my-6" />
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
              { name: "common.download", onClick: () => download(response || "") },
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
    case "blob":
      let slides = [];
      if (Array.isArray(response)) {
        slides = response.map(item => {
          if (typeof item === "string") return { url: item };
          else return item;
        });
      } else {
        if (typeof response === "string") slides = [{ url: response }];
        else slides = [response];
      }

      return <Carousel downloadable slides={slides} onVisibilityChange={handleVisibilityChange} />;
    default:
      return (
        <p className="text-neutral-700 text-base">
          {response || intl.formatMessage({ id: "reports.reports.noResponse" })}
        </p>
      );
  }
};

const ReportResponse = (props: ReportResponseProps) => {
  const { question, response, type } = props;

  return (
    <HeaderCard className="my-10" as="section">
      <HeaderCard.Header>
        <HeaderCard.HeaderText>{question}</HeaderCard.HeaderText>
      </HeaderCard.Header>
      <OptionalWrapper data={!(type === "blob" && response !== null)} elseComponent={<Response {...props} />}>
        <HeaderCard.Content>
          <Response {...props} />
        </HeaderCard.Content>
      </OptionalWrapper>
    </HeaderCard>
  );
};

export default ReportResponse;
