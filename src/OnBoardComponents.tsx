import { Components } from "./classes/Components";
import type {componentData, ComponentType,componentDictionary,componentInstance} from "./Types"
import React from "react";
import { Outputs } from "./classes/Outputs";
import type { Switches } from "./classes/Switches";

type Props={
    components: Record<string, componentData>;
    nodeConfiguration:any;
    images:Record<string, string>;
    moveComponent:(component: any ,id: string)=>void;
    placeComponent:(type:ComponentType,x:number,y:number,id?:string)=>void;
    establishConnection:(index:number, id:string)=>void;
    dragWire:(id:string, coords:number[])=>void;
    dragComponent:ComponentType | null;
    existingComponents:componentDictionary;
    existingComponentsInstance:componentInstance;
    setExistingComponents:React.Dispatch<React.SetStateAction<componentDictionary>>;
    setOffset:React.Dispatch<React.SetStateAction<number[]>>
    deleteComponent:(id:string)=>void;
    focusOn:(id:string)=>void;
   
}

type interactableButtonType={
  componentType:ComponentType;
  images:Record<string, string>;
  existingComponents:componentDictionary;
  existingComponentsInstance:componentInstance;
  setExistingComponents:React.Dispatch<React.SetStateAction<componentDictionary>>
  id:string;
}
const InteractableButton:React.FC<interactableButtonType>=({componentType,images,existingComponents,existingComponentsInstance,setExistingComponents, id})=>{
  //for switch
  const isOn=existingComponentsInstance[id].getState()
  if(componentType=="input"){
    return(<>
    <div data-type="button" className={`cursor-pointer duration-200 relative object-contain z-20 w-20 h-20 select-none m-auto [clip-path:circle()] ${(isOn)?"-translate-y-1":"-translate-y-2"}`} style={{backgroundColor:(isOn)?"#BBF6B5":"#FE6A6A" }}
      onClick={(e)=>{
      e.stopPropagation(); 
      setExistingComponents(prev=>({...prev,[id]: {...prev[id],state:!prev[id].state}}));
      existingComponentsInstance[id].setState(!existingComponentsInstance[id].getState());
      }}></div>
      <div className={`absolute inset-0 object-contain z-19 w-20 h-20 select-none m-auto [clip-path:circle()] translate-y-1}`} style={{backgroundColor:(isOn)?"#4B9F36":"#CC3A3A"}}></div>
    </>
    )
  }
  else if(componentType=="output"){
    return(
    <div className="w-20 h-20 m-auto bg-yellow-200 flex" onMouseDown={(e)=>e.stopPropagation()}>
      <input className="m-auto rounded-lg border bg-white px-2 w-full py-1 mx-2 text-xs" type="text" defaultValue="Output"/>
    </div>)
  }
  //for anything else
  else{
    return(
    // <img className="object-contain select-none w-26 h-26" src={images[componentType]} ></img>
    componentType
  )
  }
}

const OnBoardComponents: React.FC<Props> =({components, nodeConfiguration,images, moveComponent,placeComponent,establishConnection,dragWire,dragComponent,existingComponents,existingComponentsInstance, setExistingComponents, setOffset, deleteComponent, focusOn})=>{
  return(<>
        {Object.entries(components).map(([id, component],index)=>{
          const {x,y,name,componentType,state}=component;
          return(
          <div key ={index} className={`${(existingComponentsInstance[id].getState())?"bg-green-500":"bg-blue-100"} rounded-2xl w-30 flex h-30 flex items-center justify-center absolute ${(existingComponentsInstance[id].getFocused())?"shadow-[0_0_0_6px_#C084FC]":""}`} style={{top:y, left:x,}} 
          // onMouseDown={(e)=>{
          //   const target=e.target as HTMLElement;
          //   if(target.dataset.type!="button" ){
          //   (dragComponent==null)?moveComponent( component, id):placeComponent(dragComponent,x-60,y-60)}}}
          draggable onDragStart={(e)=> {
            e.dataTransfer.setData("component",componentType); 
            e.dataTransfer.effectAllowed="move"; 
            const rect  = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const deltaX=e.clientX-rect.left;
            const deltaY=e.clientY-rect.top;
            setOffset([deltaX,deltaY]);
            moveComponent(component,id)}}
         
          >
            {(componentType=="input" || componentType=="output")&&<p className="absolute -top-6" style={{}}>{`${(existingComponentsInstance[id] as Switches | Outputs).getName()}`}</p>}
            <div className="bg-red-300 w-7 h-7 absolute top-0 left-0 rounded-md flex items-center justify-center cursor-pointer"
            onMouseDown={(e)=>{deleteComponent(id)}}>
              X
            </div>
            {(existingComponentsInstance[id] instanceof Outputs)&&
            <div className="bg-purple-400 w-7 h-7 absolute top-0 right-0 rounded-md flex items-center justify-center cursor-pointer"
            onMouseDown={(e)=>{focusOn(id)}}>
              F
            </div>}
            {//for input nodes
            nodeConfiguration[componentType].inputNodePositions.map((coords: number[],index: number)=>{
              return (
              <div key ={index} className="bg-red-100 w-6 h-6 absolute border z-15 select-none" style={{left:coords[0],top:coords[1]}} onMouseDown={(e)=>{e.stopPropagation(); establishConnection(index,id)}}></div>
              )
              //make sure the index is 0 for 1 input node component and the first input of a 2 input component
              //input 1 is for the alternate input for component with 2 inputs

            })}
            {//for output nodes
            nodeConfiguration[componentType].outputNodePosition.map((coords: number[],index: number)=>{
              return (
              <div key ={index} className="bg-red-100 w-6 h-6 absolute border rounded-xl" style={{left:coords[0],top:coords[1]}} 
              onMouseDown={(e)=>{e.stopPropagation(); dragWire(id,[x,y])}}></div>
              )

            })}
            
            <InteractableButton componentType={componentType} images={images} existingComponents={existingComponents} existingComponentsInstance={existingComponentsInstance} setExistingComponents={setExistingComponents} id={id}></InteractableButton>
            
          
          </div>)
          })}
      </>)
}

  export default OnBoardComponents;