import {Gates, andGate, orGate, } from "./classes/Gates" 
import { Outputs } from "./classes/Outputs";
import { Switches } from "./classes/Switches";
import { Components } from "./classes/Components";

function resolveState(component: Components): boolean{
    //for switch and output
    //base case for input/ switches
    if(component instanceof Switches){
        return component.getState();
    }
    else if(component instanceof Gates){
        const input1=component.getSource()
        const input2=component.getAlternateSource();

        if(!input1 || !input2){return false}

        component.calculateState();
        return component.getState();
    }
    else if(component instanceof Outputs){
        const source=component.getSource();
        if(!source){return false}
        component.setState(source.getState())
        return component.getState()
    }
    return false;
}
export {resolveState}