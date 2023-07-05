
export enum RegressionAlgorithmsKey{
    RandomForest,
    KNearestNeighbours,
    ScaledVectorMachine,
    DecisionTrees,
    LinearRegression,
}

export enum ClassificationAlgorithmsApiValues {
    RandomForest = 'Random Forest Classifier',
    KNearestNeighbours = 'K-Nearest Neighbours Classifier',
    DecisionTrees = 'Decision Trees Classifier',
    NaiveBayes = 'Naive Bayes'
}

export enum RegressionAlgorithmsApiValues {
    RandomForest = 'Random Forest Regressor',
    KNearestNeighbours = 'K-Nearest Neighbours Regressor',
    ScaledVectorMachine = 'Scaled Vector Machine',
    DecisionTrees = 'Decision Trees Regressor',
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

export const classificationMachineLearningAlgo = [
    {value: ClassificationAlgorithmsApiValues.RandomForest, label: 'Random Forest Classifier'},
    {value: ClassificationAlgorithmsApiValues.KNearestNeighbours, label: 'K-Nearest Neighbours Classifier'},
    {value: ClassificationAlgorithmsApiValues.DecisionTrees, label: 'Decision Trees Classifier'},
    {value: ClassificationAlgorithmsApiValues.NaiveBayes, label: 'Naive Bayes Classifier'},
];
export const regressionMachineLearningAlgo = [
    {value: RegressionAlgorithmsApiValues.RandomForest, label: 'Random Forest'},
    {value: RegressionAlgorithmsApiValues.KNearestNeighbours, label: 'K-Nearest Neighbours'},
    {value: RegressionAlgorithmsApiValues.ScaledVectorMachine, label: 'Scaled Vector Machine'},
    {value: RegressionAlgorithmsApiValues.DecisionTrees, label: 'Decision Trees'},
    {value: RegressionAlgorithmsApiValues.LinearRegression, label: 'Linear Regression'},
];

export const convertMLsToApiValues = (mlArray: RegressionAlgorithmsKey[]) => {
    const mlAlgos = mlArray.map((mlAlgoKey: RegressionAlgorithmsKey) => mapRegressionAlgoKeyToApiValue[mlAlgoKey]);
    console.log(mlAlgos);
    return mlAlgos;
}