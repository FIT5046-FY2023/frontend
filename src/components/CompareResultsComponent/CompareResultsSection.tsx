import CompareVisualisation, { CompareVisualisationProps } from "./CompareVisualisation";

type CompareResultsProps = {} & CompareVisualisationProps;

export default function CompareResultsSection({results, loading}: CompareResultsProps) {
    return <>
        <CompareVisualisation results={results} loading={false} ></CompareVisualisation>
    </>
}