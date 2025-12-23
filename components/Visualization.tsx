import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Cable, CommercialSize, ConduitType } from '../types';

interface VisualizationProps {
  cables: Cable[];
  containerSize: CommercialSize | null;
  type: ConduitType;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  r: number; // Raio total (Cobre + Isolação)
  innerR: number; // Raio apenas do Cobre
  color: string; // Cor da Isolação (baseada na seção)
  group: string;
  x?: number;
  y?: number;
}

const Visualization: React.FC<VisualizationProps> = ({ cables, containerSize, type }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !containerSize) return;

    // Limpar renderização anterior
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Dimensões do SVG
    const width = 600;
    const height = 400;
    
    // Dimensões reais do container (mm)
    const containerW_mm = type === 'eletrocalha' ? (containerSize.width || 100) : (containerSize.internalDiameter || 50);
    const containerH_mm = type === 'eletrocalha' ? (containerSize.height || 100) : (containerSize.internalDiameter || 50);

    // Calcular Escala (Pixels por mm)
    const padding = 40;
    const scaleX = (width - padding * 2) / containerW_mm;
    const scaleY = (height - padding * 2) / containerH_mm;
    const scale = Math.min(scaleX, scaleY);

    // Dimensões de desenho escaladas
    const drawW = containerW_mm * scale;
    const drawH = containerH_mm * scale;
    
    // Centro do SVG
    const cx = width / 2;
    const cy = height / 2;

    // Preparar Dados dos Nós (Cabos)
    const nodes: Node[] = [];
    cables.forEach((cable) => {
      // 1. Calcular raio total visual (externo)
      const visualOuterRadius = (cable.diameter / 2) * scale;

      // 2. Calcular raio do cobre visual (interno)
      // A = pi * r^2  => r = sqrt(A / pi). Diâmetro = 2 * r.
      // Multiplicamos por 1.1 para simular o encordoamento (ar entre fios) de cabos flexíveis, 
      // garantindo que não fique pequeno demais visualmente.
      const copperRadiusMm = Math.sqrt(cable.section / Math.PI) * 1.1; 
      const visualInnerRadius = copperRadiusMm * scale;
      
      for (let i = 0; i < cable.quantity; i++) {
        nodes.push({
          id: `${cable.id}-${i}`,
          r: visualOuterRadius,
          innerR: visualInnerRadius,
          color: cable.color, // Cor da seção (ex: Amarelo para 4mm)
          group: cable.id,
          // Posição inicial levemente aleatória
          x: cx + (Math.random() - 0.5) * 20,
          y: cy + (Math.random() - 0.5) * 20,
        });
      }
    });

    // Criar grupo principal
    const g = svg.append("g");

    // --- Desenhar o Contorno do Conduto ---
    if (type === 'eletrocalha') {
        // Retângulo (Eletrocalha)
        g.append("rect")
         .attr("x", cx - drawW / 2)
         .attr("y", cy - drawH / 2)
         .attr("width", drawW)
         .attr("height", drawH)
         .attr("fill", "#f8fafc") // Slate-50
         .attr("stroke", "#475569") // Slate-600
         .attr("stroke-width", 3)
         .attr("rx", 4); 
         
        // Texto de dimensões
        g.append("text")
         .attr("x", cx)
         .attr("y", cy + drawH / 2 + 20)
         .attr("text-anchor", "middle")
         .attr("class", "text-xs fill-slate-500 font-mono font-bold")
         .text(`${containerSize.width}mm`);
         
        g.append("text")
         .attr("x", cx - drawW / 2 - 10)
         .attr("y", cy)
         .attr("text-anchor", "end")
         .attr("alignment-baseline", "middle")
         .attr("class", "text-xs fill-slate-500 font-mono font-bold")
         .text(`${containerSize.height}mm`);

    } else {
        // Círculo (Eletroduto)
        const r = drawW / 2;
        g.append("circle")
         .attr("cx", cx)
         .attr("cy", cy)
         .attr("r", r)
         .attr("fill", "#f8fafc")
         .attr("stroke", "#475569")
         .attr("stroke-width", 3);

        // Texto de dimensão
        g.append("text")
         .attr("x", cx)
         .attr("y", cy + r + 25)
         .attr("text-anchor", "middle")
         .attr("class", "text-xs fill-slate-500 font-mono font-bold")
         .text(`Ø ${containerSize.internalDiameter?.toFixed(1)}mm (Int)`);
    }

    // --- Simulação Física D3 ---
    const simulation = d3.forceSimulation(nodes)
        .velocityDecay(0.6) // Atrito
        .force("collide", d3.forceCollide().radius((d: any) => d.r + 0.5).strength(1).iterations(4)); // Colisão baseada no raio externo

    if (type === 'eletrocalha') {
        // Gravidade para baixo na eletrocalha
        simulation
            .force("y", d3.forceY(cy + drawH / 2).strength(0.08)) 
            .force("x", d3.forceX(cx).strength(0.01)); 

        simulation.on("tick", () => {
            // Restrições de borda (caixa)
            const left = cx - drawW / 2;
            const right = cx + drawW / 2;
            const top = cy - drawH / 2;
            const bottom = cy + drawH / 2;

            nodes.forEach(d => {
                d.x = Math.max(left + d.r, Math.min(right - d.r, d.x!));
                d.y = Math.max(top + d.r, Math.min(bottom - d.r, d.y!));
            });
            updateCircles();
        });

    } else {
        // Centralização no eletroduto
        const radius = drawW / 2;
        simulation
            .force("y", d3.forceY(cy + radius).strength(0.08)) // Leve gravidade
            .force("center", d3.forceCenter(cx, cy).strength(0.05)); 

        simulation.on("tick", () => {
            // Restrição circular
            nodes.forEach(d => {
                const dx = d.x! - cx;
                const dy = d.y! - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = radius - d.r;

                if (dist > maxDist) {
                    const angle = Math.atan2(dy, dx);
                    d.x = cx + Math.cos(angle) * maxDist;
                    d.y = cy + Math.sin(angle) * maxDist;
                }
            });
            updateCircles();
        });
    }

    // --- Renderização dos Cabos ---
    const nodeGroups = g.append("g")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g");

    // 1. Camada Externa (Isolação/Capa)
    // Usa a cor definida pela seção (SECTION_COLORS) com transparência
    nodeGroups.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => d.color) 
        .attr("fill-opacity", 0.4) 
        .attr("stroke", d => d.color)
        .attr("stroke-width", 1);

    // 2. Camada Interna (Cobre)
    // Usa cor fixa de Cobre (#b87333)
    nodeGroups.append("circle")
        .attr("r", d => d.innerR)
        .attr("fill", "#b87333") 
        .attr("stroke", "#78350f") // Contorno cobre escuro
        .attr("stroke-width", 0.5);

    // Função de atualização a cada tick da física
    function updateCircles() {
        nodeGroups.attr("transform", d => `translate(${d.x},${d.y})`);
    }

    return () => {
        simulation.stop();
    };

  }, [cables, containerSize, type]);

  if (!containerSize) {
    return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <span className="mb-2 text-2xl">⚡</span>
            <p>Adicione cabos para gerar a visualização.</p>
        </div>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full bg-slate-50 rounded-lg overflow-hidden border border-slate-200 shadow-inner flex flex-col justify-center items-center p-4 relative">
        {/* Legenda Visual */}
        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow-sm border border-slate-100 text-[10px] text-slate-600 font-medium flex flex-col gap-2 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#b87333] border border-[#78350f]"></div>
                <span>Condutor (Cobre)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 opacity-60"></div>
                <span>Isolação/Capa</span>
            </div>
        </div>
        
        <svg 
            ref={svgRef} 
            viewBox="0 0 600 400" 
            className="w-full h-full max-h-[400px] touch-none"
            preserveAspectRatio="xMidYMid meet"
        />
    </div>
  );
};

export default Visualization;