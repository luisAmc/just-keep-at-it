/**
 * @generated SignedSource<<2618647d1a4e7618eda20c98db77c757>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GetItDoneQuery$variables = {
  id: string;
};
export type GetItDoneQueryVariables = GetItDoneQuery$variables;
export type GetItDoneQuery$data = {
  readonly workout: {
    readonly " $fragmentSpreads": FragmentRefs<"GetItDone_workout">;
  };
};
export type GetItDoneQueryResponse = GetItDoneQuery$data;
export type GetItDoneQuery = {
  variables: GetItDoneQueryVariables;
  response: GetItDoneQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GetItDoneQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Workout",
        "kind": "LinkedField",
        "name": "workout",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "GetItDone_workout"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GetItDoneQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Workout",
        "kind": "LinkedField",
        "name": "workout",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "completedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "WorkoutExercise",
            "kind": "LinkedField",
            "name": "workoutExercises",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "WorkoutSet",
                "kind": "LinkedField",
                "name": "sets",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "mins",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lbs",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "reps",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Exercise",
                "kind": "LinkedField",
                "name": "exercise",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "muscleGroup",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "44b95473c21379e225944eecf1c5c5b9",
    "id": null,
    "metadata": {},
    "name": "GetItDoneQuery",
    "operationKind": "query",
    "text": "query GetItDoneQuery(\n  $id: ID!\n) {\n  workout(id: $id) {\n    ...GetItDone_workout\n    id\n  }\n}\n\nfragment GetItDone_workout on Workout {\n  id\n  name\n  status\n  createdAt\n  completedAt\n  workoutExercises {\n    id\n    sets {\n      id\n      mins\n      lbs\n      reps\n    }\n    exercise {\n      id\n      name\n      type\n      muscleGroup\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ea7eac492b3913c0c9bf8564e55f1ec0";

export default node;
