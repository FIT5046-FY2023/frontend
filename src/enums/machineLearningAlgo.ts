
export enum RegressionAlgorithmsKey{
    RandomForest,
    KNearestNeighbours,
    ScaledVectorMachine,
    DecisionTrees,
    LinearRegression,
}

export enum RegressionAlgorithmsApiValues {
    RandomForest = 'Random Forest',
    KNearestNeighbours = 'K-Nearest Neighbours',
    ScaledVectorMachine = 'Scaled Vector Machine',
    DecisionTrees = 'Decision Trees',
    LinearRegression = 'Linear Regression'
}

export const mapRegressionAlgoKeyToApiValue = {
    [RegressionAlgorithmsKey.RandomForest]: RegressionAlgorithmsApiValues.RandomForest,
    [RegressionAlgorithmsKey.KNearestNeighbours]: RegressionAlgorithmsApiValues.KNearestNeighbours,
    [RegressionAlgorithmsKey.ScaledVectorMachine]: RegressionAlgorithmsApiValues.ScaledVectorMachine,
    [RegressionAlgorithmsKey.DecisionTrees]: RegressionAlgorithmsApiValues.DecisionTrees,
    [RegressionAlgorithmsKey.LinearRegression]: RegressionAlgorithmsApiValues.LinearRegression,
};

// Can rename labels to anything without issue affecting request
export const mapRegressionAlgoKeyToLabel = {
    [RegressionAlgorithmsKey.RandomForest]: 'Random Forest', 
    [RegressionAlgorithmsKey.KNearestNeighbours]: 'K-Nearest Neighbours', 
    [RegressionAlgorithmsKey.ScaledVectorMachine]: 'Scaled Vector Machine', 
    [RegressionAlgorithmsKey.DecisionTrees]: 'Decision Trees', 
    [RegressionAlgorithmsKey.LinearRegression]: 'Linear Regression'
};

export const machineLearningAlgo = [
    {value: RegressionAlgorithmsKey.RandomForest, label: 'Random Forest'},
    {value: RegressionAlgorithmsKey.KNearestNeighbours, label: 'K-Nearest Neighbours'},
    {value: RegressionAlgorithmsKey.ScaledVectorMachine, label: 'Scaled Vector Machine'},
    {value: RegressionAlgorithmsKey.DecisionTrees, label: 'Decision Trees'},
    {value: RegressionAlgorithmsKey.LinearRegression, label: 'Linear Regression'},
];

export const convertMLsToApiValues = (mlArray: RegressionAlgorithmsKey[]) => {
    const mlAlgos = mlArray.map((mlAlgoKey: RegressionAlgorithmsKey) => mapRegressionAlgoKeyToApiValue[mlAlgoKey]);
    console.log(mlAlgos);
    return mlAlgos;
}