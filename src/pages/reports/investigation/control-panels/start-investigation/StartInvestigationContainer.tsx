import { connect, ConnectedProps } from "react-redux";
import StartInvestigationControlPanel from "pages/reports/investigation/control-panels/start-investigation/StartInvestigation";
import { RootState } from "store";
import { getLayers } from "modules/layers";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = ({ templates, layers }: RootState) => {
  // @ts-ignore
  const layersOptions = Object.values(layers.selectedLayers)
    // @ts-ignore
    .filter(layer => layer.attributes.enabled)
    .map(layer => ({
      // @ts-ignore
      option: layer.id,
      // @ts-ignore
      label: layer.attributes.name
    }));

  return {
    templates: templates.templates,
    layersOptions
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>) => ({
  getLayers: () => dispatch(getLayers())
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(StartInvestigationControlPanel);
