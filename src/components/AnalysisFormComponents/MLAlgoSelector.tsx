import {
    SelectChangeEvent,
  } from "@mui/material";
  import { MLTypes } from "../../enums/machineLearningTasks";
  import Selector from "./Selector";
import { classificationMachineLearningAlgo, regressionMachineLearningAlgo } from "../../enums/machineLearningAlgo";
  
  interface MLAlgoSelectorProps {
      name: string;
      value: string; 
      onChange?: ((event: SelectChangeEvent<any>, child: React.ReactNode) => void);
      mlType: MLTypes
  }
  const MLAlgoSelector = ({value, onChange, name, mlType} : MLAlgoSelectorProps) => {

    switch (mlType) {
        
        case MLTypes.Classification:
            return <Selector name={name} value={value} options={classificationMachineLearningAlgo} label={"Machine Learning Algorithm"} onChange={onChange} ></Selector>
        
        case MLTypes.Regression:
            return <Selector name={name} value={value} options={regressionMachineLearningAlgo} label={"Machine Learning Algorithm"} onChange={onChange} ></Selector>

    
        default:
            return <></>;
    }
      
  };
  
  export {MLAlgoSelector};
  