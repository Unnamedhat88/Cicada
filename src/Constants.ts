import andGateImage from "./images/Andgate.png";
import orGateImage from "./images/Orgate.svg";
import notGateImage from "./images/Notgate.png";
import norGateImage from "./images/Norgate.png";
import nandGateImage from "./images/Nandgate.png";
import xnorGateImage from "./images/Xnorgate.png"
import xorGateImage from "./images/Xorgate.png";

import type {ComponentType} from "./Types"
import {Components} from "./classes/Components"
import {andGate,orGate,norGate,nandGate,xorGate,xnorGate, notGate} from "./classes/Gates"
import {Switches} from "./classes/Switches";
import { Outputs } from "./classes/Outputs";


export const images: Record<ComponentType, string>={
    andGate:andGateImage,
    orGate:orGateImage,
    notGate:notGateImage,
    output:"",
    input:"",
    norGate:norGateImage,
    nandGate:nandGateImage,
    xorGate:xorGateImage,
    xnorGate:xnorGateImage,
  }
  
export const nodeConfiguration: Record<ComponentType, { inputNodePositions:[number,number][], outputNodePosition:[number,number][]}>={
    andGate:{inputNodePositions:[[-10,15],[-10,81]],outputNodePosition:[[106,48]]},
    orGate:{inputNodePositions:[[-10,15],[-10,81]],outputNodePosition:[[106,48]]},
    notGate:{inputNodePositions:[[-10,48]],outputNodePosition:[[106,48]]},
    output:{inputNodePositions:[[-10,48]],outputNodePosition:[]},
    input:{inputNodePositions:[],outputNodePosition:[[106,48]]},
    norGate:{inputNodePositions:[[-10,15],[-10,81]],outputNodePosition:[[106,48]]},
    nandGate:{inputNodePositions:[[-10,15],[-10,81]],outputNodePosition:[[106,48]]},
    xorGate:{inputNodePositions:[[-10,15],[-10,81]],outputNodePosition:[[106,48]]},
    xnorGate:{inputNodePositions:[[-10,15],[-10,81]],outputNodePosition:[[106,48]]},

  }

export const instanceClasses: Record<ComponentType, new (...args:any[])=>Components> ={
    andGate:andGate,
    orGate:orGate,
    notGate:notGate,
    input:Switches,
    output:Outputs,
    norGate:norGate,
    nandGate:nandGate,
    xorGate:xorGate,
    xnorGate:xnorGate,


}