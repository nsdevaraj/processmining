
import { useState, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  NodeTypes,
  EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  Search,
  Save,
  Share2,
  Download,
} from "lucide-react";
import { initialNodes, initialEdges } from "@/data/processFlowData";
import CustomNode from "@/components/process-flow/CustomNode";
import CustomEdge from "@/components/process-flow/CustomEdge";
import NodeToolbar from "@/components/process-flow/NodeToolbar";

const nodeTypes: NodeTypes = {
  input: CustomNode,
  default: CustomNode,
  output: CustomNode,
};

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
};

export default function ProcessFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: !isAnimating,
      }))
    );
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Process Flow</h1>
          <p className="text-muted-foreground">
            Interactive visualization of procurement process flow
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 size={16} className="mr-1" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <Save size={16} className="mr-1" /> Save
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-1" /> Export
          </Button>
        </div>
      </div>

      <Card className="mb-4 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All Variants</TabsTrigger>
                <TabsTrigger value="happy">Happy Path</TabsTrigger>
                <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
                <TabsTrigger value="rework">Rework Loops</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search process step..." 
                  className="pl-8 h-9 w-60"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAnimation}
                className="gap-1"
              >
                {isAnimating ? (
                  <>
                    <Pause size={16} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={16} /> Animate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div style={{ height: "70vh", width: "100%" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              attributionPosition="bottom-right"
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              <Controls
                showInteractive={false}
                className="bg-card border shadow-md rounded-md"
                style={{
                  // Fix for style object
                  backgroundColor: "transparent"
                }}
              >
                <Button size="icon" variant="ghost">
                  <ZoomIn size={18} />
                </Button>
                <Button size="icon" variant="ghost">
                  <ZoomOut size={18} />
                </Button>
                <Button size="icon" variant="ghost">
                  <Maximize2 size={18} />
                </Button>
              </Controls>
              <MiniMap
                nodeStrokeWidth={3}
                maskColor="rgba(0, 0, 0, 0.1)"
                className="bg-card border shadow-md rounded-md hidden lg:block"
              />
            </ReactFlow>
            {selectedNode && selectedNode.data && (
              <NodeToolbar
                data={{
                  label: String(selectedNode.data.label || ''),
                  avgDuration: String(selectedNode.data.avgDuration || ''),
                  casesAffected: Number(selectedNode.data.casesAffected || 0),
                  totalCases: Number(selectedNode.data.totalCases || 1),
                  deviationRate: String(selectedNode.data.deviationRate || '0%'),
                  slaCompliance: String(selectedNode.data.slaCompliance || '100%')
                }}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
