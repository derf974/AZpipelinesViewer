import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator'
import { Typography } from '@mui/joy';
import {SuccessIcon,FailedIcon,CancelIcon,SkippedIcon} from './icons'

const StepProgressBar = ({ stages,filteredStage }) => {
  const ref_result = {
    "" : "neutral",
    "completed.skipped" : "neutral",
    "inProgress" : "primary",
    "completed.failed" : "danger",
    "completed.succeeded" : "success"
    
  };
  const getStatus = (status,result) => {
    let iconComponent;
    let fullstatus = `${status}.${result}`
    switch (fullstatus) {
      case '.InProgress':
        iconComponent = < SkippedIcon/>;
        break;
      case 'completed.succeeded':
        iconComponent = <SuccessIcon />;
        break;
      case 'completed.failed':
        iconComponent = <FailedIcon />;
        break;
      default:
        iconComponent = <CancelIcon />;
        break;
    }
    return iconComponent;
  };
  return (
    <div className="container mt-4">
                <div className='pipeline' >
                <Stepper sx={{ width: '100%' }}>
                    {/* {stages.filter(stage => filteredStage
                                              .find(elm=> elm === stage.name) )
                                              .sort((a, b) => a.order - b.order)
                                              .map((stage, index) => ( */}
                    {stages.sort((a, b) => a.order - b.order)
                                              .map((stage, index) => (
                                                <Step orientation="vertical"
                                                  indicator={
                                                    <>
                                                    <StepIndicator variant="solid" color={ref_result[`${stage.status}.${stage.result}`]} >
                                                      {getStatus(stage.status,stage.result)}
                                                    </StepIndicator>
                                                    </>
                                                  }><Typography level="body-xs">{stage.name}</Typography></Step>
                    ))}
                    </Stepper>
                </div>
    </div>
  );
};

export default StepProgressBar;
