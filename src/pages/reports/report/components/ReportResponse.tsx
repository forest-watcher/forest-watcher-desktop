import classNames from "classnames";
import Carousel from "components/carousel/Carousel";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import HeaderCard from "components/ui/Card/HeaderCard";
import Modal from "components/ui/Modal/Modal";
import Toggle from "components/ui/Toggle/Toggle";
import { AnswerResponse } from "generated/forms/formsSchemas";
import { download } from "helpers/exports";
import AudioResponse from "pages/reports/report/components/AudioResponse";
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
  const { response, type, handleVisibilityChange } = props;

  const intl = useIntl();

  switch (type) {
    case "audio":
      return <AudioResponse {...props} />;
    case "blob":
      let slides = [];
      if (Array.isArray(response)) {
        slides = response.map(item => {
          if (typeof item === "string") return { url: item };
          else return item;
        });
      } else {
        if (typeof response === "string") slides = [{ url: response, isPublic: true }];
        else slides = [response];
      }

      return <Carousel downloadable sharable slides={slides} onVisibilityChange={handleVisibilityChange} />;
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
