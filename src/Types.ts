import {Components} from "./classes/Components"
export type ComponentType = "andGate" | "orGate" | "input" | "output" | "notGate" | "xorGate" | "xnorGate" | "norGate" | "nandGate";
export type componentData={x:number, y:number, name:string , componentType: ComponentType, state:boolean, focus:boolean};
export type componentDictionary = Record<string, componentData>
export type wireConnection = {startingComponent:string, destinationComponent:string, inputPort:number}
export type componentInstance = Record<string, Components>