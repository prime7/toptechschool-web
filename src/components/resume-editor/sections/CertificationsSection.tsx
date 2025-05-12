import React from 'react';
import { useResume } from '../context/ResumeContext';
import { CertificationsEditor } from '../components/CertificationsEditor';
import { CertificationItem } from '../types';

const CertificationsSection: React.FC = () => {
  const { state, dispatch } = useResume();

  const handleAddCertification = (certification: CertificationItem) => {
    dispatch({
      type: 'ADD_CERTIFICATION',
      payload: certification
    });
  };

  const handleUpdateCertification = (id: string, data: Omit<CertificationItem, 'id'>) => {
    dispatch({
      type: 'UPDATE_CERTIFICATION',
      payload: { id, data }
    });
  };

  const handleRemoveCertification = (id: string) => {
    dispatch({
      type: 'REMOVE_CERTIFICATION',
      payload: id
    });
  };

  return (
    <CertificationsEditor
      certifications={state.certifications || []}
      onAdd={handleAddCertification}
      onUpdate={handleUpdateCertification}
      onRemove={handleRemoveCertification}
    />
  );
};

export default CertificationsSection; 