import * as React from 'react';
import { Button, FormGroup, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';

import './WithHelperText.css';

type HelperTextPopoverProps = {
  label: string;
  triggerAction?: 'click' | 'hover';
  content: React.ReactNode;
};

type FormGroupWithHelperTextProps = HelperTextPopoverProps & {
  isRequired?: boolean;
};

const HelperTextPopover = ({
  ariaLabel,
  content,
  triggerAction,
}: Omit<HelperTextPopoverProps, 'label'> & { ariaLabel: string }) => (
  <Popover aria-label={ariaLabel} bodyContent={content} withFocusTrap triggerAction={triggerAction}>
    <Button
      component="a"
      className="fctl-helper-text__icon"
      isInline
      variant="plain"
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
      aria-label={`${ariaLabel} help text`}
    >
      <OutlinedQuestionCircleIcon />
    </Button>
  </Popover>
);

const LabelWithHelperText = ({
  label,
  hideLabel,
  content,
  triggerAction,
}: HelperTextPopoverProps & { hideLabel?: boolean }) => (
  <>
    {!hideLabel && label}
    <HelperTextPopover ariaLabel={label} content={content} triggerAction={triggerAction} />
  </>
);

export const FormGroupWithHelperText = ({
  label,
  isRequired,
  content,
  children,
}: React.PropsWithChildren<FormGroupWithHelperTextProps>) => (
  <FormGroup
    label={label}
    labelIcon={<HelperTextPopover ariaLabel={label} content={content} />}
    isRequired={isRequired}
  >
    {children}
  </FormGroup>
);

export default LabelWithHelperText;
