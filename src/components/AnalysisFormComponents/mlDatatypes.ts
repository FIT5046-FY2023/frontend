import { RegressionAlgorithmsApiValues, ClassificationAlgorithmsApiValues } from "../../enums/machineLearningAlgo";
import { MLTypes } from "../../enums/machineLearningTasks";

interface KNNOptions {
    KNNneighbours?: number;
  }
  
  interface RandomForestOptions {
    trees?: number;
  }
  
  export interface MLData {
    mlType: MLTypes | "";
    mlAlgo:
      | RegressionAlgorithmsApiValues
      | ClassificationAlgorithmsApiValues
      | "";
    mlOptions: KNNOptions & RandomForestOptions & {};
  }
  
  export interface MLDataList {
    MLData: MLData[];
  }
  