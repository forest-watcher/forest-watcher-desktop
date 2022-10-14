import IconCard from "components/icon-card/IconCard";

const ReportDetails = () => {
  return (
    <section className="row column py-section">
      <h1 className="font-base text-[36px] font-light text-gray-700 mb-10">Report Name</h1>
      <section className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        <IconCard iconName={"check"} title="Completed Date" text="lorem ipsum" />
        <IconCard iconName={"check"} title="Completed Date" text="lorem ipsum" />
        <IconCard iconName={"check"} title="Completed Date" text="lorem ipsum" />
        <IconCard iconName={"check"} title="Completed Date" text="lorem ipsum" />
        <IconCard iconName={"check"} title="Completed Date" text="lorem ipsum" />
      </section>
    </section>
  );
};

export default ReportDetails;
