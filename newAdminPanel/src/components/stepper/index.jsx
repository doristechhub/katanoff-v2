import { memo } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const CustomStepper = memo(({ activeStep = 0, steps }) => {
  if (!steps?.length) return;
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps?.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
});

export default CustomStepper;
