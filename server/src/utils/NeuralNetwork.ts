/**
 * Custom Multi-Layer Perceptron (MLP) Neural Network
 * Implemented in pure TypeScript to avoid native dependency issues.
 * 
 * Capability:
 * - Layers: Input -> Hidden -> Output
 * - Activation: Sigmoid
 * - Learning: Backpropagation (Gradient Descent)
 */

export class NeuralNetwork {
    private inputNodes: number;
    private hiddenNodes: number;
    private outputNodes: number;
    private learningRate: number;

    // Weights
    private weightsIH: number[][]; // Input -> Hidden
    private weightsHO: number[][]; // Hidden -> Output

    // Biases
    private biasH: number[];
    private biasO: number[];

    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number, learningRate: number = 0.1) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        this.learningRate = learningRate;

        // Initialize weights and biases with random values (-1 to 1)
        this.weightsIH = this.randomMatrix(this.hiddenNodes, this.inputNodes);
        this.weightsHO = this.randomMatrix(this.outputNodes, this.hiddenNodes);
        this.biasH = this.randomArray(this.hiddenNodes);
        this.biasO = this.randomArray(this.outputNodes);
    }

    /**
     * Train the network with input data and expected target output
     */
    train(inputArray: number[], targetArray: number[]) {
        // --- Forward Pass ---

        // Hidden Layer
        const hiddenInputs = this.dotProduct(this.weightsIH, inputArray);
        const hiddenOutputs = this.addBiasAndActivate(hiddenInputs, this.biasH);

        // Output Layer
        const finalInputs = this.dotProduct(this.weightsHO, hiddenOutputs);
        const finalOutputs = this.addBiasAndActivate(finalInputs, this.biasO);

        // --- Backward Pass (Backpropagation) ---

        // Calculate Output Errors (Target - Output)
        const outputErrors = targetArray.map((t, i) => t - finalOutputs[i]);

        // Calculate Hidden Errors (Weights_HO_Transposed * Output_Errors)
        const weightsHO_T = this.transpose(this.weightsHO);
        const hiddenErrors = this.dotProduct(weightsHO_T, outputErrors);

        // Update Weights: Hidden -> Output
        // deltas = lr * error * gradient * hidden_output_transposed
        this.updateWeights(this.weightsHO, this.biasO, outputErrors, finalOutputs, hiddenOutputs);

        // Update Weights: Input -> Hidden
        this.updateWeights(this.weightsIH, this.biasH, hiddenErrors, hiddenOutputs, inputArray);
    }

    /**
     * Predict output for a given input
     */
    predict(inputArray: number[]): number[] {
        // Hidden Layer
        const hiddenInputs = this.dotProduct(this.weightsIH, inputArray);
        const hiddenOutputs = this.addBiasAndActivate(hiddenInputs, this.biasH);

        // Output Layer
        const finalInputs = this.dotProduct(this.weightsHO, hiddenOutputs);
        const finalOutputs = this.addBiasAndActivate(finalInputs, this.biasO);

        return finalOutputs;
    }

    // --- Math Helpers ---

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private dsigmoid(y: number): number {
        // Derivative of sigmoid (y is already activated value)
        return y * (1 - y);
    }

    private addBiasAndActivate(inputs: number[], bias: number[]): number[] {
        return inputs.map((val, i) => this.sigmoid(val + (bias[i] || 0)));
    }

    private updateWeights(weights: number[][], bias: number[], errors: number[], outputs: number[], inputs: number[]) {
        for (let i = 0; i < weights.length; i++) {
            const gradient = errors[i] * this.dsigmoid(outputs[i]);

            // Adjust Bias
            bias[i] += gradient * this.learningRate;

            // Adjust Weights
            for (let j = 0; j < weights[i].length; j++) {
                const delta = this.learningRate * gradient * inputs[j];
                weights[i][j] += delta;
            }
        }
    }

    private dotProduct(matrix: number[][], vector: number[]): number[] {
        return matrix.map(row =>
            row.reduce((sum, weight, i) => sum + weight * vector[i], 0)
        );
    }

    private transpose(matrix: number[][]): number[][] {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    private randomMatrix(rows: number, cols: number): number[][] {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() * 2 - 1)
        );
    }

    private randomArray(length: number): number[] {
        return Array.from({ length: length }, () => Math.random() * 2 - 1);
    }
}
