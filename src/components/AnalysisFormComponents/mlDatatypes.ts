import { RegressionAlgorithmsApiValues, ClassificationAlgorithmsApiValues } from "../../enums/machineLearningAlgo";
import { mlOptionFields } from "../../enums/machineLearningOptions";
import { MLTypes } from "../../enums/machineLearningTasks";

export type KNNOptions = {
    [mlOptionFields.KNNneighbours]?: number;
};
  
  interface RandomForestOptions {
    [mlOptionFields.RFTrees]?: number;
  }
  
  export interface MLData {
    mlType: MLTypes | "";
    mlAlgo:
      | RegressionAlgorithmsApiValues
      | ClassificationAlgorithmsApiValues
      | "";
    mlOptions: KNNOptions | RandomForestOptions | {};
  }
  
  export interface MLDataList {
    MLData: MLData[];
  }
  