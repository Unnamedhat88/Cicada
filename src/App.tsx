import { useEffect, useRef, useState } from "react"
import ToolBar from "./ToolBar";
import {Outputs} from "./classes/Outputs";
import {useTrackMousePosition} from "./useTrackMousePosition";
import {resolveState} from "./resolveState"
import OnBoardComponents  from "./OnBoardComponents";
import {type componentData, type componentDictionary, type ComponentType, type wireConnection,type componentInstance} from "./Types"
import {images, nodeConfiguration, instanceClasses} from "./Constants"
import OnBoardWires from "./OnBoardWires";
import BackEndLogic from "./BackEndLogic";
import { Gates } from "./classes/Gates";
import { Switches } from "./classes/Switches";
import {Components} from "./classes/Components";
import TruthTablePanel from "./TruthTablePanel";


function App() {
  
  //to keep track of whether or not toolbox open or not
  const [isToolBarOpen, setIsToolBarOpen]=useState<boolean>(false);
  //to keep track of the component that was selected
  const [dragComponent, setDragComponent]=useState<ComponentType | null >(null);
  //to keep track of the wire coor that was selected
  const [dragWireMode, setDragWireMode]=useState<number[] | null>(null);
  //to keep track of the selected wire id
  const [prevNodeId, setPrevNodeId]= useState<string | null>(null)
  //to keep track of the component being moved/ dragged when someone moves component
  const [draggingId,setdraggingID]=useState<null| string>(null);

  const [offset, setOffset]=useState<number[]>([0,0]);
  const switchCount=useRef(0);
  const outputCount=useRef(0);
  const names=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

  const [x,y] = useTrackMousePosition();

  const[isTruthPanelOn,setIsTruthPanelOn]= useState(false);

  //components that are present in the screen
  const [existingComponents,setExistingComponents]=useState<componentDictionary>({});
  //wires that are present in the screen
  const [existingWires, setExistingWires]= useState<wireConnection[]>([]);

  //for the backend of calculating the wire states
  const [existingComponentsInstance, setExistingComponentsInstance]=useState<componentInstance>({})
  const [existingOutputId, setExistingOutputId]=useState<Array<string>>([])
  const [existingInputId, setExistingInputId]=useState<Array<string>>([])

  const [warning,setWarning]=useState(false);

  useEffect(()=>{
    const newInfo=BackEndLogic({existingComponents,existingComponentsInstance,existingOutputId,existingInputId});
    if(JSON.stringify(newInfo)!==JSON.stringify(existingComponents)){
      setExistingComponents(newInfo)
    }
  },[existingComponents, existingComponentsInstance,existingOutputId, existingWires,existingInputId])

  const focusOn=(id:string):void=>{
    const recursionComponent=(componentInstance:Components):void=>{
      componentInstance.setFocused(!componentInstance.getFocused());
      //base case
      if(componentInstance instanceof Switches){
        return;
      }
      const source =componentInstance.getSource();
      if(source!=null){
      recursionComponent(source)
      }
      if(componentInstance instanceof Gates){
        const alternateSource=componentInstance.getAlternateSource();
        if(alternateSource){recursionComponent(alternateSource)}
      }
    }
    
    //this is the funcitno that calls the first recrusion
    
    const newInstance={...existingComponentsInstance};
    const target = newInstance[id];
    recursionComponent(target);
    newInstance[id]=target;
    setExistingComponentsInstance(newInstance);




  }


  const placeComponent=( dragComponent: ComponentType , x: number, y:number , id?:string):void=>{
    if (draggingId){
      setExistingComponents(prev=>({...prev,[draggingId]:{...prev[draggingId],x:x,y:y}}))

    }
    //for moved components
    else{

    //for new components
    const newId= `${Date.now()}-${Math.floor(Math.random()*10000)}`
    setExistingComponents(prev=>({...prev,[newId]:{x:x,y:y,name:`Component ${existingComponents.length}`,componentType:dragComponent, state:false, focus:false}}))
    if(dragComponent=="input" ){
      const name= "SW "+names[switchCount.current]
      setExistingComponentsInstance(prev=>({...prev,[newId]:new instanceClasses[dragComponent](newId,name)}))
      switchCount.current=switchCount.current+1;
    }
    else if(dragComponent=="output"){
      const name="OU "+names[outputCount.current]
      setExistingComponentsInstance(prev=>({...prev,[newId]:new instanceClasses[dragComponent](newId,name)}))
      outputCount.current=outputCount.current+1;
    }
    else{
      setExistingComponentsInstance(prev=>({...prev,[newId]:new instanceClasses[dragComponent](newId)}))

    }
    if(dragComponent=="output"){setExistingOutputId(prev=>[...prev,newId]);}
    if(dragComponent=="input"){setExistingInputId(prev=>[...prev,newId]);}
    
    }

    setDragComponent(null);
    setdraggingID(null);
    

}
  const deleteComponent=(id: string):void=>{
    const newComponents={...existingComponents};
    delete newComponents[id];

    const newComponentsInstance={...existingComponentsInstance}
    delete newComponentsInstance[id];

    const newOutputIds=existingOutputId.filter(outputId=>outputId!==id);
    const newInputIds=existingInputId.filter(inputId=>inputId!==id);
    const newWires=existingWires.filter(
      wire=>wire.destinationComponent!==id && wire.startingComponent!==id
    )
    
    const newInfo = BackEndLogic({
      existingComponents:newComponents,
      existingComponentsInstance:newComponentsInstance,
      existingOutputId:newOutputIds,
      existingInputId:newInputIds
    })

    setExistingComponents(newInfo);
    setExistingComponentsInstance(newComponentsInstance);
    setExistingOutputId(newOutputIds);
    setExistingWires(newWires);
    setExistingInputId(newInputIds);

  }

  const moveComponent=(component: componentData, id : string):void=>{
    const {x,y,name,componentType,state}=component;
    setDragComponent(componentType);
    setdraggingID(id)
    
  }
  const dragWire=(index: string, coords:number[]):void=>{
    setDragWireMode(coords);
    setPrevNodeId(index);

  }

  const establishConnection=(index:number, destination_id:string):void=>{
    //input, 0 is for the first input of a 2 node component or only input
    //input 1 is for alternate 
    if(prevNodeId){
      
      setExistingWires([...existingWires,{startingComponent:prevNodeId, destinationComponent:destination_id, inputPort:index}]);
      if(index==0){
        existingComponentsInstance[destination_id].setSource(existingComponentsInstance[prevNodeId]);}
      else if(index==1 && existingComponentsInstance[destination_id] instanceof Gates){
        existingComponentsInstance[destination_id].setAlternateSource(existingComponentsInstance[prevNodeId]);}
      

      // const newInfo=BackEndLogic({existingComponents,existingComponentsInstance,existingOutputId})
      // setExistingComponents(newInfo);
      setPrevNodeId(null);
      setDragWireMode(null);
    }
    
  }
  


  return (<div>
  {(isTruthPanelOn)&&<TruthTablePanel setIsTruthPanelOn={setIsTruthPanelOn} existingComponentsInstance={existingComponentsInstance} existingInputId={existingInputId} existingOutputId={existingOutputId}></TruthTablePanel>}
  <div className={`z-50 top-6 right-6 absolute bg-green-100 rounded-xl flex items-center justify-center ${(existingInputId.length>8 || existingOutputId.length>10)?"opacity-40":"cursor-pointer"}`} style={{width:"180px",height:"50px"}}
  onClick={(e)=>{if (existingInputId.length<=8 && existingOutputId.length<=10)setIsTruthPanelOn(true)}}
  onMouseEnter={(e)=>{if (existingInputId.length>8 || existingOutputId.length>10)setWarning(true)}}
  onMouseLeave={(e)=>{if (existingInputId.length>8 || existingOutputId.length>10)setWarning(false)}}>
    Generate Truth Table
    
  </div>
  {(warning)&&<div className="absolute top-18 right-6 text-center" style={{bottom:"-20px", color:"#FF0000",width:"180px"}}>To use this feature, please make sure the number of input and output are below 9</div>}
  {/* for board */}
  <div className="absolute w-screen h-screen overflow-hidden"
  onDragOver={(e)=>{e.preventDefault()}}
  onDrop={(e)=>{
    const type = e.dataTransfer.getData("component");
    if(!type)return;
    const x = e.clientX-offset[0];
    const y = e.clientY-offset[1];
    placeComponent(type as ComponentType,x,y);
    setOffset([0,0])
  }}>
  {/* ghost wire */}
  
  <svg className="w-screen h-screen absolute -z-5 " style={{pointerEvents:"none"}}>
    {(dragWireMode)?(dragWireMode==null)?"":<path 
        d={`M ${dragWireMode[0]+60} ${dragWireMode[1]+60} 
        L ${(x+dragWireMode[0])/2} ${dragWireMode[1]+60} 
        L ${(x+dragWireMode[0])/2} ${y} 
        L ${x} ${y}`} stroke="black" fill="transparent" strokeWidth={2}></path>
    :""}
    <OnBoardWires existingWires={existingWires} existingComponents={existingComponents} images={images} existingComponentsInstance={existingComponentsInstance}/>

    </svg>

      <OnBoardComponents 
        components={existingComponents} 
        nodeConfiguration={nodeConfiguration} 
        images={images} 
        moveComponent={moveComponent} 
        placeComponent={placeComponent} 
        establishConnection={establishConnection} 
        dragWire={dragWire} 
        dragComponent={dragComponent}
        existingComponents={existingComponents}
        existingComponentsInstance={existingComponentsInstance}
        setExistingComponents={setExistingComponents}
        setOffset={setOffset}
        deleteComponent={deleteComponent}
        focusOn={focusOn}
        />


      {/* ghost circuit */}
      
      
    </div>
      <ToolBar setIsToolBarOpen={setIsToolBarOpen} isToolBarOpen={isToolBarOpen} setDragComponent={setDragComponent} setOffset={setOffset}/>
    </div>
    
  )
}

export default App
