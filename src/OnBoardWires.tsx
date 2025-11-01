import { Gates, notGate } from "./classes/Gates";
import type OnBoardComponents from "./OnBoardComponents";
import type {componentData,wireConnection,componentInstance} from "./Types"
type Props={
    existingWires:wireConnection[];
    existingComponents:Record<string, componentData>;
    images:Record<string, string>;
    existingComponentsInstance:componentInstance;

}
const OnBoardWires: React.FC<Props> =({existingWires, existingComponents,images,existingComponentsInstance})=>{
    return(<>
            {existingWires.map((item,index)=>{
            const {startingComponent,destinationComponent,inputPort}=item;
            const oldX=existingComponents[startingComponent].x+60;
            let newX=existingComponents[destinationComponent].x+60;
            const oldY=existingComponents[startingComponent].y+60;
            let newY=existingComponents[destinationComponent].y+60;

            if(existingComponentsInstance[destinationComponent] instanceof Gates && !(existingComponentsInstance[destinationComponent] instanceof notGate)){
                newX-=56
                newY+=(inputPort==0)?-32:33
                
            }
            return(<>
            {(existingComponentsInstance[destinationComponent].getFocused())&&<path 
            d={`M ${oldX} ${oldY} 
            L ${(oldX+newX)/2} ${oldY} 
            L ${(oldX+newX)/2} ${newY} 
            L ${newX} ${newY}`} stroke={`#C084FC`} fill="transparent" strokeWidth={6}>
            </path>}
            
            <path 
            d={`M ${oldX} ${oldY} 
            L ${(oldX+newX)/2} ${oldY} 
            L ${(oldX+newX)/2} ${newY} 
            L ${newX} ${newY}`} stroke={`${(existingComponentsInstance[startingComponent].getState())?"lightGreen":"black"}`} fill="transparent" strokeWidth={2}>
            </path>
            
            </>
        )}
        )}
    </>)
}
export default OnBoardWires;