import { StoryObj } from "@storybook/react";
import { CertificationsEditor } from "../CertificationsEditor";
import { CertificationItem } from "../../types";
import { useState } from "react";

const meta = {
  title: 'Resume/CertificationsEditor',
  component: CertificationsEditor,
  parameters: { layout: 'padded' }
};

export default meta;
type Story = StoryObj<typeof CertificationsEditor>;

const CertificationsEditorWithState = () => {
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);

  const handleAdd = (certification: CertificationItem) => {
    setCertifications([...certifications, certification]);
  };

  const handleUpdate = (id: string, data: Omit<CertificationItem, 'id'>) => {
    setCertifications(certifications.map(cert => cert.id === id ? { ...cert, ...data } : cert));
  };

  const handleRemove = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  return <CertificationsEditor certifications={certifications} onAdd={handleAdd} onUpdate={handleUpdate} onRemove={handleRemove} />;
};

export const Default: Story = {
  render: () => <CertificationsEditorWithState />
};