import { Button, Flex, Input, Spinner, Stack, Textarea } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BASE_URL } from "../App";

function tokenize(problem: string) {
    const tokenRegex = /\b(min|max)\b|[+-]?\d+|[a-zA-Z]+\d*|[+-]?\d+|[+-]|>=|<=|=|\n\b/g;
    return problem.match(tokenRegex);
}

type ObjectiveFunction = {
    isMinimize: boolean;
    coefficients: string[];
};

enum Relation {
    LessEqual = "<=",
    GreaterEqual = ">=",
    Equal = "=",
}

type Constraint = {
    coefficients: string[];
    relation: Relation;
    rhs: string;
};

type LinearProblem = {
    variables: string[];
    objectiveFunction: ObjectiveFunction;
    constraints: Constraint[];
};

const keywords = ["min", "max", "minimize", "maximize"];


function parseProblem(problem: string) : LinearProblem {
    const tokens = tokenize(problem);

    let lastWasRelation = false;
    const constraintGroups: Map<string, string>[] = [];
    let currConstraintGroup: Map<string, string> = new Map();
    let relations: Relation[] = [];
    let rhs: string[] = [];
    let isMinimize: boolean | null = null;
    let objectiveVariables: Map<string, string> = new Map();
    let isObjective = false;

    let currSignPositive = true;
    let currCoefficient: string | null = null;
    const uniqueVariables = new Set<string>();

    tokens?.forEach((token) => {
        if (token === "st" || token === "\n") {
            if (currConstraintGroup.size > 0) {
                constraintGroups.push(currConstraintGroup);
                currConstraintGroup = new Map();
            }

            currCoefficient = null;
            currSignPositive = true;
            isObjective = false;
            return;
        }
        
        if (keywords.includes(token)) {
            if (isMinimize !== null) {
                throw new Error("Multiple objective functions");
            }

            isMinimize = token === "min" || token === "minimize";
            isObjective = true;
        } else if (token[0].match(/[a-zA-Z]/)) {
            const variable = token;
            uniqueVariables.add(variable);
            const coefficient = currSignPositive ? currCoefficient || "1" : `-${currCoefficient || "1"}`;
            
            if (isObjective) {
                objectiveVariables.set(variable, coefficient);
            } else {
                currConstraintGroup.set(variable, coefficient);
            }

            currCoefficient = null;
            currSignPositive = true;
        } else if (token.match(/[+-]?[0-9]+/)) {
            currCoefficient = token;
            if (lastWasRelation) {
                rhs.push(currCoefficient);
            }
        } else if (token[0] === "+" || token[0] === "-") {
            currSignPositive = token[0] === "+";
        } else {
            switch (token) {
                case "<=":
                    relations.push(Relation.LessEqual);
                    break;
                case ">=":
                    relations.push(Relation.GreaterEqual);
                    break;
                case "=":
                    relations.push(Relation.Equal);
                    break;
            }
        }

        if (lastWasRelation) {
            constraintGroups.push(currConstraintGroup);
            currConstraintGroup = new Map();
            lastWasRelation = false;
            isObjective = false;
        } else {
            lastWasRelation = token[token.length - 1] === "=";
        }
    });

    if (isMinimize === null) {
        throw new Error("No objective function");
    }

    return {
        variables: Array.from(uniqueVariables),
        objectiveFunction: {
            isMinimize: isMinimize,
            coefficients: Array.from(uniqueVariables).map((variable) => {
                const coefficient = objectiveVariables.get(variable);
                return coefficient || "0";
            }),
        },
        constraints: constraintGroups.map((group, i) => {
            return {
                coefficients: Array.from(uniqueVariables).map((variable) => {
                    const coefficient = group.get(variable);
                    return coefficient || "0";
                }),
                relation: relations[i],
                rhs: rhs[i],
            };
        }),
    }
}

export default function LinearProblemForm({ 
    setVariables, 
    setObjectCoefficients,
    setSimplexData
} : 
{ 
    setVariables: (variables: string[]) => void,
    setObjectCoefficients: (objective: string[]) => void,
    setSimplexData: (data: any) => void 
}) {
    const [problem, setProblem] = useState("");

    const { mutate: handleSubmit, isPending } = useMutation({
        mutationKey: ['submit'],
        mutationFn: async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                const parsed = parseProblem(problem);

                // Make POST request to server
                const res = await fetch(BASE_URL + '/twophase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(parsed)
                });

                console.log(JSON.stringify(parsed));

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Something went wrong!');
                }

                setObjectCoefficients(parsed.objectiveFunction.coefficients);
                setVariables(parsed.variables);
                setSimplexData(data);

                console.log(data);
            } catch (error: any) {
                alert(error.message);
                console.error(error);
            }
        },
        onSuccess: () => {
            console.log("Submitted");
        },
        onError: (error) => {
            console.error(error);
        }
    });

    return (
            <form onSubmit={ handleSubmit }>
            <Flex gap={2} direction="column" minHeight={200} minWidth="100%" padding={4} align="center">
                <Textarea
                    minHeight="inherit"
                    maxWidth="80vw"
                    variant={"subtle"}
                    placeholder="Enter the linear optimization problem here"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    ref={(input) => input && input.focus()}
                />
                <Button
                    width="50%"
                    type='submit'
                    _active={{
                        bg: 'gray.800',
                        transform: 'scale(0.95)'
                    }}
                    _focus={{
                        boxShadow: 'outline'
                    }}
                >
                    {!isPending && "Solve"}
                    {isPending && <Spinner size="sm" ml={2} />}
                </Button>
            </Flex>
        </form>
    );
}
