import { ComponentStory, ComponentMeta } from "@storybook/react";
import Modal from "components/ui/Modal/Modal";
import { useState } from "react";
import Button from "components/ui/Button/Button";
import ExportModal, { TExportForm } from "./ExportModal";
import { IProps as IModalProps } from "components/modals/FormModal";
import { UnpackNestedValue } from "react-hook-form";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Modals/Export Modal",
  component: Modal
} as ComponentMeta<typeof Modal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Modal> = args => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<UnpackNestedValue<TExportForm> | null>(null);

  const onSave: IModalProps<TExportForm>["onSave"] = async data => {
    return new Promise(resolve =>
      setTimeout(() => {
        setIsOpen(false);
        setValues(data);
        resolve();
      }, 2000)
    );
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <pre className="u-margin-top">
        <code>{values && JSON.stringify(values, null, 2)}</code>
      </pre>
      {isOpen && (
        <ExportModal
          {...args}
          onClose={() => setIsOpen(false)}
          onSave={onSave}
          fileTypes={[
            { label: "Shape file", value: ".shp" },
            { label: "Geojson", value: ".geojson" }
          ]}
          fields={[
            { label: "Field 1", value: "1" },
            { label: "Field 2", value: "2" }
          ]}
        />
      )}
    </div>
  );
};

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {};
