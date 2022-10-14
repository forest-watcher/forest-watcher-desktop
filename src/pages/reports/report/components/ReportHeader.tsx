import Icon from "components/extensive/Icon";
import Button from "components/ui/Button/Button";
import { useHistory } from "react-router-dom";

const ReportHeader = () => {
  const history = useHistory();

  return (
    <div className="bg-gray-700">
      <section className="row column py-7">
        <button onClick={() => history.goBack()} className="flex items-center gap-1">
          <Icon name="chevron-left" className="text-green-500" size={10} />
          <p className="text-green-500">Back to Reports</p>
        </button>

        <div className="flex justify-between items-center mt-5">
          <h1 className="font-base text-[36px] font-light text-gray-300">Report Detail</h1>
          <div className="flex gap-4">
            <Button>Share</Button>
            <Button variant="secondary-light-text">Export</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportHeader;
