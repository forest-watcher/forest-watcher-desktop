import List from "components/extensive/List";
import { Layers } from "generated/clayers/clayersResponses";
import {
  useDeleteV3ContextualLayerLayerId,
  usePostV3ContextualLayerTeamTeamId
} from "generated/clayers/clayersComponents";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import { FormattedMessage, useIntl } from "react-intl";
import HeaderCard from "components/ui/Card/HeaderCard";
import { TeamResponse } from "generated/core/coreResponses";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { useAccessToken } from "hooks/useAccessToken";
import FormModal from "components/modals/FormModal";
import { useMemo, useState } from "react";
import { UnpackNestedValue } from "react-hook-form";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Option } from "types";
import { useAppSelector } from "hooks/useRedux";
import { toastr } from "react-redux-toastr";
import { RootState } from "store";

type LayersCardProps = {
  title: string;
  titleIsKey?: boolean;
  items: Layers["data"];
  refetchLayers: () => void;
  layersLoading: boolean;
  team?: TeamResponse["data"];
};

type TAssignLayersForm = {
  layers: string[];
};

const addLayersSchema = yup
  .object()
  .shape({
    layers: yup.array().max(3).required()
  })
  .required();

const LayersCard = ({ title, items, refetchLayers, layersLoading, titleIsKey = true, team }: LayersCardProps) => {
  const { httpAuthHeader } = useAccessToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { gfw: gfwLayers } = useAppSelector((state: RootState) => state.layers);

  const intl = useIntl();

  const canBeLoadable = items.some(item => !item.attributes?.isPublic);
  const loading = canBeLoadable ? layersLoading : false;
  const isTeam = !!team;
  const isMyTeam = team?.attributes?.userRole === "administrator" || team?.attributes?.userRole === "manager";

  const { mutateAsync: addNewTeamLayer } = usePostV3ContextualLayerTeamTeamId();
  const { mutateAsync: deleteTeamLayer } = useDeleteV3ContextualLayerLayerId();

  const layerOptions = useMemo<Option[] | undefined>(
    () =>
      gfwLayers?.map((layer: any) => ({
        label: intl.formatMessage({ id: layer.title }),
        value: layer.tileurl
      })),
    [gfwLayers, intl]
  );

  const selectedOptions = useMemo<string[]>(() => items?.map(item => item.attributes?.url || ""), [items]);

  const onModalSave = async (data: UnpackNestedValue<TAssignLayersForm>) => {
    try {
      const promises: Promise<any>[] = [];

      // Delete all..
      items.forEach(item => {
        promises.push(deleteTeamLayer({ pathParams: { layerId: item.id }, headers: httpAuthHeader }));
      });

      await Promise.all(promises);

      // Find Layers
      const layers = data.layers.map(url => gfwLayers.find(layer => layer.tileurl === url));

      for (let i = 0; i < layers.length; i++) {
        const item = layers[i];
        await addNewTeamLayer({
          body: { name: item?.title || "", url: item?.tileurl || "", enabled: true },
          pathParams: { teamId: team?.id || "" },
          headers: httpAuthHeader
        });
      }
      toastr.success(intl.formatMessage({ id: "layers.success" }), "");

      setIsModalOpen(false);
    } catch (e: any) {
      toastr.error(intl.formatMessage({ id: "layers.error" }), "");
      console.error(e);
    } finally {
      refetchLayers();
    }
  };

  return (
    <>
      <HeaderCard className="mt-7" as="section">
        <HeaderCard.Header className="flex justify-between align-middle">
          <HeaderCard.HeaderText>{titleIsKey ? <FormattedMessage id={title} /> : title}</HeaderCard.HeaderText>
          <OptionalWrapper data={isTeam && isMyTeam}>
            <Button onClick={() => setIsModalOpen(true)}>
              <FormattedMessage id="common.edit" />
            </Button>
          </OptionalWrapper>
        </HeaderCard.Header>
        <HeaderCard.Content className="pb-0">
          <LoadingWrapper loading={loading} className="py-10 relative">
            <OptionalWrapper
              data={items.length > 0}
              elseComponent={
                <p className="text-base mb-7">
                  <FormattedMessage id="layers.noLayers" />
                </p>
              }
            >
              <List
                items={items}
                itemClassName="text-neutral-700 uppercase text-sm font-[500] mb-7"
                render={(item, index) => <FormattedMessage id={`${item.attributes?.name}`} />}
              />
            </OptionalWrapper>
          </LoadingWrapper>
        </HeaderCard.Content>
      </HeaderCard>
      <FormModal<TAssignLayersForm>
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onModalSave}
        modalTitle="layers.teamLayers.edit"
        modalSubtitle="layers.teamLayers.editSubtitle"
        submitBtnName="common.done"
        key={selectedOptions.length}
        useFormProps={{ resolver: yupResolver(addLayersSchema), defaultValues: { layers: selectedOptions } }}
        inputs={[
          {
            id: "select-templates",
            selectProps: {
              label: intl.formatMessage({ id: "layers.teamLayers.subtitle" }),
              placeholder: intl.formatMessage({ id: "layers.teamLayers.subtitle" }),
              options: layerOptions,
              defaultValue: []
            },
            hideLabel: true,
            isMultiple: true,
            registerProps: {
              name: "layers"
            },
            formatErrors: errors => errors.layers
          }
        ]}
      />
    </>
  );
};

export default LayersCard;
