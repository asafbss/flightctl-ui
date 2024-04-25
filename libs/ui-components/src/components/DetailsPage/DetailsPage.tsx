import * as React from 'react';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  PageSection,
  Spinner,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';

import { getErrorMessage } from '../../utils/error';
import DetailsNotFound from './DetailsNotFound';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../hooks/useAppContext';

export type DetailsPageProps = {
  id: string;
  title?: string;
  children: React.ReactNode;
  error: unknown;
  loading: boolean;
  resourceType: 'Fleets' | 'Devices' | 'Repositories' | 'Enrollment requests';
  resourceLink: string;
  actions?: React.ReactNode;
  nav?: React.ReactNode;
};

const DetailsPage: React.FC<DetailsPageProps> = ({
  id,
  title,
  children,
  error,
  loading,
  resourceLink,
  resourceType,
  actions,
  nav,
}) => {
  const { t } = useTranslation();
  const {
    router: { Link },
  } = useAppContext();
  let content = children;
  if (error) {
    const msg = getErrorMessage(error);
    if (msg === 'Error 404: Not Found') {
      return <DetailsNotFound kind={resourceType} id={id} />;
    }
    content = (
      <Alert isInline variant="danger" title={t('Failed to retrieve resource details')}>
        {getErrorMessage(error)}
      </Alert>
    );
  } else if (loading) {
    content = (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      <PageSection variant="light" type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={resourceLink}>{resourceType}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{title || id}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection variant="light">
        <Split hasGutter>
          <SplitItem isFilled>
            <Title headingLevel="h1" size="3xl" role="heading">
              {title || id}
            </Title>
          </SplitItem>
          <SplitItem>{actions}</SplitItem>
        </Split>
      </PageSection>
      {nav && (
        <PageSection variant="light" type="nav">
          {nav}
        </PageSection>
      )}
      <PageSection>{content}</PageSection>
    </>
  );
};

export default DetailsPage;
