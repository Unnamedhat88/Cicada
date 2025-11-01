import { useMemo } from "react";
import { Outputs } from "./classes/Outputs";
import { Switches } from "./classes/Switches";
import type {componentInstance} from "./Types"
import type { Components } from "./classes/Components";
import { Gates } from "./classes/Gates";
type Props={
    setIsTruthPanelOn:React.Dispatch<React.SetStateAction<boolean>>;
    existingComponentsInstance:componentInstance;
    existingOutputId:string[]|null[];
    existingInputId:string[]|null[];

   
}
const TruthTablePanel: React.FC<Props> =({setIsTruthPanelOn,existingComponentsInstance,existingInputId,existingOutputId})=>{
    
  
  //generating all the possible combinations
  const inputCombinations= useMemo(()=>{
    const n:number = existingInputId.length;
    const combinations: boolean[][]=[];

    for (let i=0;i<2**n;i++){
        const temp:boolean[] =i.toString(2).padStart(n,"0").split("").map((e)=>e==="1");
        combinations.push(temp);
        }
    return combinations;

  },[existingInputId])

  //recursion to help build blueprint
  const bluePrintBuilder=(comp : Components | null):any=>{
    if(!comp)return null;

    if(comp instanceof Switches){
        return comp.id;
    }
    if(comp instanceof Outputs){
        return bluePrintBuilder(comp.getSource())
    }
    if(comp instanceof Gates){
        const a: string |string[] = bluePrintBuilder(comp.getSource());
        const b: string| string[]= bluePrintBuilder(comp.getAlternateSource());
        return [comp.constructor.name.toUpperCase(),a,b ]
    }

  }
  //maps out the formula/blueprint of the output i.e., A= [AND,B,[OR,C,D]]

  const outputBlueprint = useMemo(()=>{
    const map: Record<string, any> ={}
    existingOutputId.forEach((id)=>{
        if(!id)return null;
        map[id]=bluePrintBuilder(existingComponentsInstance[id]);
    });
    return map;
  },[existingOutputId,existingComponentsInstance])

  //recursion function to evaluate the blueprint
  type Blueprintnode = string |[string, Blueprintnode?, Blueprintnode?];
  const evaluateBluePrint=(node:Blueprintnode,inputCombinations:Record<string,boolean>):boolean=>{
    if(!node)return false;

    if(typeof node === "string"){
        return inputCombinations[node]
    }
    const[gateType,a,b]=node;
    switch (gateType.toUpperCase()){
        case "ANDGATE": return evaluateBluePrint(a!,inputCombinations) && evaluateBluePrint(b!,inputCombinations);
        case "ORGATE": return evaluateBluePrint(a!,inputCombinations) || evaluateBluePrint(b!,inputCombinations);
        case "XORGATE": return evaluateBluePrint(a!,inputCombinations) !== evaluateBluePrint(b!,inputCombinations);
        case "NANDGATE": return !(evaluateBluePrint(a!,inputCombinations) && evaluateBluePrint(b!,inputCombinations));
        case "NORGATE": return !(evaluateBluePrint(a!,inputCombinations) || evaluateBluePrint(b!,inputCombinations));
        case "NOTGATE": return !(evaluateBluePrint(a!,inputCombinations));
        default: return false;
    
    }

    

  }

  //main loop to calc each scenario of input combinations
  const TruthTable=useMemo(()=>{
    const table:boolean[][]=[];
    for (let i=0;i<inputCombinations.length;i++){
        const tempInput:Record<string,boolean>={};
        const currInputCombination = inputCombinations[i]
        existingInputId.forEach((id, idx)=>{
            if(id!==null){
                tempInput[id]=currInputCombination[idx];
            }
        })
        const tempOutput:Record<string,boolean>={};
        Object.entries(outputBlueprint).forEach(([id,blueprint])=>{
            console.log(blueprint);
            if(id!==null)tempOutput[id]=evaluateBluePrint(blueprint,tempInput)
        })

        table.push([...currInputCombination, ...Object.values(tempOutput)])
        

        }
    return table;
    },[inputCombinations,existingInputId,,outputBlueprint])


  return(
  <>
    <div className="absolute w-screen h-screen bg-gray-700/30 bg-opacity-40 backdrop-blur-[1.5px] flex justify-center items-center" style={{zIndex:"60"}}>
        <div className="h-7/8 w-6/8 bg-white">
            <div className="cursor-pointer ml-4 mt-4 w-10 h-10 flex justify-center items-center" onClick={()=>setIsTruthPanelOn(false)}>X</div>
                <div className="max-w-4xl mx-auto my-8 p-4 shadow-lg rounded-lg bg-white">
                                  
                    <table className="table-auto w-full text-center border border-gray-300">
                        <thead className="">
                            <tr>
                                {existingInputId.map((id,idx)=>{
                                    return(<th key={idx} className="px-6 py-3 font-medium text-gray-700 border bg-blue-100">{(existingComponentsInstance[id!] as Switches).getName()}</th>)
                                })}
                                {existingOutputId.map((id,idx)=>{
                                    return(<th key={idx} className="px-6 py-3 font-medium text-gray-700 border bg-blue-400">{(existingComponentsInstance[id!] as Outputs).getName()}</th>)
                                })}
                                
                            </tr>

                        </thead>
                        <tbody className="bg-red-100">
                            {TruthTable!.map((arr, rowidx)=>{
                                return(
                                <tr key={rowidx}>
                                    {arr.map((e, colidx)=>{return(<td className="border" key={colidx}>{e?1:0}</td>)})}
                                </tr>)
                            })}

                        </tbody>
 
                    </table>

                </div>

        </div>
    </div>
  </>)
}

export default TruthTablePanel;