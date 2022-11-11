import Icon from "components/extensive/Icon";
import Button from "components/ui/Button/Button";
import { Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";

type ReportHeaderProps = {
  setShowExportModal: Dispatch<SetStateAction<boolean>>;
};

const ReportHeader = ({ setShowExportModal }: ReportHeaderProps) => {
  const history = useHistory();

  return (
    <div className="bg-neutral-700">
      <section className="row column py-7">
        <button onClick={() => history.goBack()} className="flex items-center gap-1">
          <Icon name="chevron-left" className="text-primary-500" size={10} />
          <p className="text-primary-500">Back to Reports</p>
        </button>

        <div className="flex justify-between items-center mt-5">
          <h1 className="font-base text-[36px] font-light text-neutral-300">Report Detail</h1>
          <Button onClick={() => setShowExportModal(true)}>Export</Button>
        </div>
      </section>
    </div>
  );
};

export default ReportHeader;
