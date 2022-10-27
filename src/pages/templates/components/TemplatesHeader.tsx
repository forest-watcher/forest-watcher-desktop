import { Link } from "react-router-dom";

const TemplatesHeader = () => {
  return (
    <div className="bg-gray-700">
      <section className="row column py-8">
        <div className="flex justify-between items-center">
          <h1 className="font-base text-[36px] font-light text-gray-300">Templates</h1>
          <Link className="c-button c-button--primary" to={`/templates/create`}>
            Create Template
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TemplatesHeader;
