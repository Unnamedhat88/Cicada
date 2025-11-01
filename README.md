# Logic Circuit Simulator – Interactive Digital Logic Playground

A browser-based simulator for designing and analyzing digital logic circuits.  
Built with **TypeScript**, **React**, and **Tailwind CSS**, it enables drag-and-drop gate placement, real-time wiring, and automatic truth-table generation.

> **Status:** In active development.  
> Core functionality (gate interaction, wire connection, and truth-table generation) is implemented, while performance tuning and logic-propagation stability are currently being refined.

---

## Overview

The simulator models the behavior of basic logic gates — **AND**, **OR**, **NOT**, **XOR**, and more — through a clean, interactive interface.  
It explores how user-constructed circuits can be evaluated and visualized entirely client-side, emphasizing both usability and correct logical resolution.

![Logic Circuit Simulator Preview](https://raw.githubusercontent.com/Unnamedhat88/Portfolio_3D/main/public/images/proj3.webp)


---

## Core Features

- **Drag-and-Drop Circuit Design** – Intuitive canvas interface for placing and connecting gates.   
- **Signal Tracing** – Selecting an output highlights all contributing ancestor gates.  
- **Automatic Truth Table Generation** – Calculates truth tables from the current circuit topology.  
- **Responsive Layout** – Built with Tailwind for fast rendering and adaptability.

---

## Technical Highlights

### Frontend
- **React + TypeScript** for componentized logic and strong typing.  
- **Tailwind CSS** for design consistency and performance.  

### Logic Engine
- Represents components as nodes linked through dependency mappings between sources and dependents.
- Uses an indegree-based topological traversal (Kahn’s algorithm) to determine valid evaluation order.
- Supports real-time propagation by re-evaluating only affected nodes when an input changes.
- Modular design enabling future support for sequential logic.

### UX and Interaction
- Drag events, hover feedback, and focus states for visual clarity.  
- Efficient event handling to maintain smooth interactions even on complex layouts.



