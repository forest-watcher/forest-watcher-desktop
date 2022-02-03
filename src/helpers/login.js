import querystring from "query-string";

const trimQueryParams = props => {
  const { location, history } = props;
  const search = location.search || "";
  const queryParams = querystring.parse(search);
  if (queryParams.token) {
    const newSearch = querystring.stringify({ ...queryParams, token: undefined });
    history.replace("/areas", { search: newSearch });
  }
};

export { trimQueryParams };
