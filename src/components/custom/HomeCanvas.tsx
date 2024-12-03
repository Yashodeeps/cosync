"use client";

import React, { useState, useRef } from "react";
import { Square, Triangle, Type, Move, Trash2 } from "lucide-react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const generateId = () => Math.random().toString(36).substr(2, 9);

interface RectangleElement {
  id: string;
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface TriangleElement {
  id: string;
  type: "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface TextElement {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

type Element = RectangleElement | TriangleElement | TextElement;

const HomeCanvas = () => {
  const [selectedTool, setSelectedTool] = useState("select");
  const whiteboardRef = useRef<SVGSVGElement | null>(null);
  const [elements, setElements] = useState<Element[]>([
    {
      id: generateId(),
      type: "text",
      x: 170,
      y: 170,
      text: "CS CANVAS",
      fontSize: 24,
      color: "#fff",
    },
    {
      id: generateId(),
      type: "triangle",
      x: 250,
      y: 200,
      width: 100,
      height: 100,
      color: "#3B82F6",
    },
    {
      id: generateId(),
      type: "text",
      x: 100,
      y: 70,
      text: "{ cosync }",
      fontSize: 20,
      color: "#10B981",
    },
    {
      id: generateId(),
      type: "text",
      x: 400,
      y: 70,
      text: "<labs/>",
      fontSize: 20,
      color: "#F43F5E",
    },
    {
      id: generateId(),
      type: "triangle",
      x: 50,
      y: 250,
      width: 80,
      height: 80,
      color: "#8B5CF6",
    },
    {
      id: generateId(),
      type: "triangle",
      x: 100,
      y: 100,
      width: 80,
      height: 80,
      color: "#EC4899",
    },
    {
      id: generateId(),
      type: "text",
      x: 200,
      y: 30,
      text: "== SYSTEM ONLINE ==",
      fontSize: 18,
      color: "#34D399",
    },
  ]);

  const handleMouseDown = (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    element: Element,
  ) => {
    if (selectedTool !== "select" || !whiteboardRef.current) return;

    const svg = whiteboardRef.current;
    const startX = e.clientX;
    const startY = e.clientY;

    const startElementX = element.x;
    const startElementY = element.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      // Update element position based on initial position and movement
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === element.id
            ? { ...el, x: startElementX + dx, y: startElementY + dy }
            : el,
        ),
      );
    };

    const onMouseUp = () => {
      svg.removeEventListener("mousemove", onMouseMove);
      svg.removeEventListener("mouseup", onMouseUp);
    };

    svg.addEventListener("mousemove", onMouseMove);
    svg.addEventListener("mouseup", onMouseUp);
  };

  const handleTextEdit = (element: TextElement) => {
    const newText = prompt("Edit text:", element.text);
    if (newText !== null) {
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === element.id ? { ...el, text: newText } : el,
        ),
      );
    }
  };

  const renderElement = (element: Element) => {
    switch (element.type) {
      case "triangle":
        return (
          <polygon
            key={element.id}
            points={`${element.x},${element.y} ${element.x + element.width},${
              element.y
            } ${element.x + element.width / 2},${element.y + element.height}`}
            onMouseDown={(e) => handleMouseDown(e, element)}
            className="cursor-move"
            stroke={element.color}
            fill="transparent"
          />
        );

      case "text":
        return (
          <text
            key={element.id}
            x={element.x}
            y={element.y}
            fill={element.color}
            fontSize={element.fontSize}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onDoubleClick={() => handleTextEdit(element)}
            className={`${orbitron.className} cursor-text`}
          >
            {element.text}
          </text>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex   rounded-2xl p-3 h-96  z-20 relative mx-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute top-3 left-3 text-xs text-gray-500">
        You can drag elements :D
      </div>

      <svg ref={whiteboardRef} width="100%" height="100%" className="">
        {elements.map(renderElement)}
      </svg>
    </div>
  );
};

export default HomeCanvas;
