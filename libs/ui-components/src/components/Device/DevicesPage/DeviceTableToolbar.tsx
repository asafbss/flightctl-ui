import * as React from 'react';
import {
  Button,
  Chip,
  ChipGroup,
  Split,
  SplitItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';

import { TableTextSearchProps } from '../../Table/TableTextSearch';
import { useTranslation } from '../../../hooks/useTranslation';
import DeviceStatusFilter, { getStatusItem } from './DeviceFilterSelect';
import { FilterStatusMap, UpdateStatus } from './types';
import { FlightCtlLabel } from '../../../types/extraTypes';
import { labelToString } from '../../../utils/labels';
import DeviceTableToolbarFilters from './DeviceToolbarFilters';

type DeviceTableToolbarProps = {
  nameOrAlias: TableTextSearchProps['value'];
  setNameOrAlias: TableTextSearchProps['setValue'];
  ownerFleets: string[];
  setOwnerFleets: (ownerFleets: string[]) => void;
  activeStatuses: FilterStatusMap;
  setActiveStatuses: (statuses: FilterStatusMap) => void;
  selectedLabels: FlightCtlLabel[];
  setSelectedLabels: (labels: FlightCtlLabel[]) => void;
  isFilterUpdating: boolean;
};

const DeviceTableToolbar: React.FC<React.PropsWithChildren<DeviceTableToolbarProps>> = ({ children, ...rest }) => {
  const {
    ownerFleets,
    setOwnerFleets,
    nameOrAlias,
    setNameOrAlias,
    activeStatuses,
    setActiveStatuses,
    selectedLabels,
    setSelectedLabels,
    isFilterUpdating,
  } = rest;

  const updateStatus: UpdateStatus = (statusType, status) => {
    if (!statusType) {
      setActiveStatuses(
        Object.keys(activeStatuses).reduce((acc, curr) => {
          acc[curr] = [];
          return acc;
        }, {} as FilterStatusMap),
      );
    } else {
      if (!status) {
        setActiveStatuses({ ...activeStatuses, [statusType]: [] });
      } else {
        if (activeStatuses[statusType].find((s) => s === status)) {
          const newStatuses = activeStatuses[statusType].filter((s) => s !== status);
          setActiveStatuses({ ...activeStatuses, [statusType]: newStatuses });
        } else {
          const newValue = [...activeStatuses[statusType], status];
          setActiveStatuses({ ...activeStatuses, [statusType]: newValue });
        }
      }
    }
  };

  return (
    <>
      <Toolbar id="devices-toolbar" inset={{ default: 'insetNone' }}>
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem variant="search-filter">
              <DeviceStatusFilter
                activeStatuses={activeStatuses}
                updateStatus={updateStatus}
                isFilterUpdating={isFilterUpdating}
              />
            </ToolbarItem>
            <ToolbarItem variant="search-filter">
              <DeviceTableToolbarFilters
                selectedLabels={selectedLabels}
                selectedFleetNames={ownerFleets}
                setSelectedLabels={setSelectedLabels}
                setSelectedFleets={setOwnerFleets}
                nameOrAlias={nameOrAlias}
                setNameOrAlias={setNameOrAlias}
              />
            </ToolbarItem>
          </ToolbarGroup>
          {children}
        </ToolbarContent>
      </Toolbar>
      <DeviceToolbarChips {...rest} updateStatus={updateStatus} />
    </>
  );
};

type DeviceToolbarChipsProps = Omit<DeviceTableToolbarProps, 'setActiveStatuses'> & {
  updateStatus: UpdateStatus;
};

const DeviceToolbarChips = ({
  activeStatuses,
  updateStatus,
  nameOrAlias,
  setNameOrAlias,
  ownerFleets,
  setOwnerFleets,
  selectedLabels,
  setSelectedLabels,
}: DeviceToolbarChipsProps) => {
  const { t } = useTranslation();
  const statusKeys = Object.keys(activeStatuses).filter((k) => !!activeStatuses[k as keyof FilterStatusMap].length);
  return (
    <Split hasGutter>
      {statusKeys.map((k) => {
        const key = k as keyof FilterStatusMap;
        const { title, items } = getStatusItem(t, key);
        return (
          <SplitItem key={key}>
            <ChipGroup categoryName={title} isClosable onClick={() => updateStatus(key)}>
              {activeStatuses[key].map((status: string) => (
                <Chip key={status} onClick={() => updateStatus(key, status)}>
                  {items.find(({ id }) => id === status)?.label}
                </Chip>
              ))}
            </ChipGroup>
          </SplitItem>
        );
      })}
      {!!ownerFleets.length && (
        <SplitItem>
          <ChipGroup categoryName={t('Fleet')} isClosable onClick={() => setOwnerFleets([])}>
            {ownerFleets.map((fleetId) => (
              <Chip key={fleetId} onClick={() => setOwnerFleets(ownerFleets.filter((f) => f !== fleetId))}>
                {fleetId}
              </Chip>
            ))}
          </ChipGroup>
        </SplitItem>
      )}
      {nameOrAlias && (
        <SplitItem>
          <ChipGroup categoryName={t('Name / Alias')} isClosable onClick={() => setNameOrAlias('')}>
            <Chip onClick={() => setNameOrAlias('')}>{nameOrAlias}</Chip>
          </ChipGroup>
        </SplitItem>
      )}
      {!!selectedLabels.length && (
        <SplitItem>
          <ChipGroup categoryName={t('Labels')} isClosable onClick={() => setSelectedLabels([])}>
            {selectedLabels.map((label) => {
              const labelStr = labelToString(label);
              return (
                <Chip
                  key={labelStr}
                  onClick={() => setSelectedLabels(selectedLabels.filter((l) => labelToString(l) !== labelStr))}
                >
                  {labelStr}
                </Chip>
              );
            })}
          </ChipGroup>
        </SplitItem>
      )}
      {(!!statusKeys.length || !!ownerFleets.length || !!nameOrAlias || !!selectedLabels.length) && (
        <SplitItem>
          <Button
            variant="link"
            onClick={() => {
              updateStatus();
              setOwnerFleets([]);
              setNameOrAlias('');
              setSelectedLabels([]);
            }}
          >
            {t('Clear all filters')}
          </Button>
        </SplitItem>
      )}
    </Split>
  );
};

export default DeviceTableToolbar;
