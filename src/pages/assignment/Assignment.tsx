import { FC } from "react";
import Hero from "components/layouts/Hero/Hero";
import Loader from "components/ui/Loader";
import { useParams } from "react-router-dom";
import Article from "components/layouts/Article";

export type TParams = {
  id: string;
};

const Assignment: FC = props => {
  const { id } = useParams<TParams>();
  const isLoading = false;

  return (
    <>
      <Loader isLoading={isLoading} />
      <Hero title="assignment.title" />
      <Article>
        <div className="l-content">Assignment detail here! {id}</div>
      </Article>
    </>
  );
};

export default Assignment;
