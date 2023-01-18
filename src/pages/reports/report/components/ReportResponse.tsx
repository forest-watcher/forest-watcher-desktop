import classNames from "classnames";
import Carousel from "components/carousel/Carousel";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import HeaderCard from "components/ui/Card/HeaderCard";
import Modal from "components/ui/Modal/Modal";
import { AnswerResponse } from "generated/forms/formsSchemas";
import { download } from "helpers/exports";
import { useState } from "react";

export interface IReportResponse {
  question: string;
  response: string;
  type: string;
}

export interface ReportResponseProps extends IReportResponse {
  childQuestions?: AnswerResponse[];
}

const Response = (props: ReportResponseProps) => {
  const { response, type, childQuestions } = props;
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  switch (type) {
    case "audio":
      const filename = response?.split("/").pop() || "";

      return (
        <>
          {childQuestions?.map(child => (
            <Response key={child.name} response={child.value || ""} type="text" question="" />
          ))}
          {filename && (
            <button
              onClick={() => {
                setAudioModalOpen(true);
              }}
              className={classNames(
                "bg-primary-400 px-4 py-[9px] rounded-md border border-solid border-primary-500 text-neutral-700 text-base",
                Boolean(childQuestions?.length) && "mt-6"
              )}
            >
              {filename}
            </button>
          )}
          <Modal
            isOpen={audioModalOpen}
            title="audio.play"
            onClose={() => setAudioModalOpen(false)}
            actions={[
              { name: "common.download", onClick: () => download(response) },
              { name: "common.close", variant: "secondary", onClick: () => setAudioModalOpen(false) }
            ]}
          >
            <div className="w-full h-full flex justify-center align-middle">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio src={response} autoPlay controls />
            </div>
          </Modal>
        </>
      );
    case "blob":
      return (
        <Carousel
          downloadable
          slides={
            // Make sure to always pass an array of images
            response && Array.isArray(response) ? response : response && !Array.isArray(response) ? [response] : []
          }
        />
      );
    default:
      return <p className="text-neutral-700 text-base">{response ?? "N/A"}</p>;
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
