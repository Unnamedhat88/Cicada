import type {componentDictionary,componentInstance, ComponentType} from "./Types"
import { resolveState } from "./resolveState";
import { Gates, notGate } from "./classes/Gates";
import type { Components } from "./classes/Components";


type Props={
    existingComponents:componentDictionary;
    existingComponentsInstance:componentInstance;
    existingOutputId:string[]|null[];
    existingInputId:string[]|null[];

}
function BackEndLogic({existingComponents,existingComponentsInstance,existingOutputId,existingInputId}:Props):componentDictionary{

    Object.entries(existingComponentsInstance).forEach(([id,instance])=>{
        if(!instance) return;

        if(existingComponents[id].componentType!=="input"){
        instance.setState(false);
        }
    })

    const newInfo={...existingComponents}
    //grab the dependencies and set up the in degree
    const inDegree: Record<string, number>={};
    const dependencies: Record<string, string[]>={};
    const dependent: Record<string,string[]>={};

    Object.entries(newInfo).forEach(([id,comp])=>{
        const temp_array: string[]= []

        if (existingComponentsInstance[id].getSource()!=null){
        temp_array.push(existingComponentsInstance[id].getSource()!.id)}
        if (existingComponentsInstance[id] instanceof Gates && existingComponentsInstance[id].getAlternateSource()!=null){
            temp_array.push(existingComponentsInstance[id].getAlternateSource()!.id)
        }
        dependencies[id]=temp_array
        inDegree[id]=temp_array.length
    })
    // built dependent array
    Object.entries(dependencies).forEach(([id,dependenciesArray])=>{
        dependenciesArray.forEach((val)=>{
            if(!dependent[val]) dependent[val]=[];
            dependent[val].push(id)
        })

    })

    //initialize the input component / component with 0 in degrees
    const queue: string[]=[];
    Object.entries(inDegree).forEach(([id,inDeg])=>{
        if(inDeg==0){queue.push(id)}
    })
  


    while(queue.length!=0){
        const elementId =queue.shift()!;
        resolveState(existingComponentsInstance[elementId])
        if (dependent[elementId]){
        dependent[elementId].forEach((e)=>{
            inDegree[e]-=1
            if(inDegree[e]==0){queue.push(e)}
        })}


    }
    //sync the frontend with backend information
    Object.entries(existingComponentsInstance).forEach(([id, instance])=>{
        if(!instance)return;
        newInfo[id]={...newInfo[id],state:instance.getState()}
    })
 


    

    return newInfo


}

export default BackEndLogic