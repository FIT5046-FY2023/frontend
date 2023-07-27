import {
  SelectChangeEvent,
} from "@mui/material";
import { machineLearningTasks } from "../../enums/machineLearningTasks";
import Selector from "./Selector";

interface MLTypeSelectorProps {
    name: string;
    value: string; 
    onChange?: ((event: SelectChangeEvent<any>, child: React.ReactNode) => void);
}
const MLTypeSelector = ({value, onChange, name} : MLTypeSelectorProps) => {
  return (
    <Selector name={name} value={value} options={machineLearningTasks} label={"Machine Learning Type"} onChange={onChange} ></Selector>
  );
};

export {MLTypeSelector};
