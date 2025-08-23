import React, { useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
  Handle,
  Position,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users } from "lucide-react";
import { IOrganizationStructure } from "../types";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

export type ChartStyle =
  | "hierarchical"
  | "radial"
  | "horizontal"
  | "compact"
  | "mindmap";

export interface ChartStyleOption {
  value: ChartStyle;
  label: string;
  description: string;
}

interface OrganizationNodeData {
  organization: IOrganizationStructure;
  level: number;
  style?: ChartStyle;
}

// Custom Organization Node Component with Handles
const OrganizationNode: React.FC<{ data: OrganizationNodeData }> = ({
  data,
}) => {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();
  const { organization, level, style = "hierarchical" } = data;

  // Check if current language is Arabic
  const isArabic = currentLocale === "ar";

  const getNodeColor = (level: number) => {
    // Different color schemes based on chart style
    switch (style) {
      case "mindmap":
        return `hsl(${(level * 60) % 360}, 70%, 50%)`;
      case "radial":
        const radialColors = [
          "#10b981",
          "#06b6d4",
          "#8b5cf6",
          "#f59e0b",
          "#ef4444",
          "#64748b",
        ];
        return radialColors[Math.min(level, radialColors.length - 1)];
      case "compact":
        const compactColors = [
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#10b981",
          "#64748b",
        ];
        return compactColors[Math.min(level, compactColors.length - 1)];
      case "horizontal":
        const horizontalColors = [
          "#7c3aed",
          "#2563eb",
          "#dc2626",
          "#059669",
          "#f59e0b",
          "#64748b",
        ];
        return horizontalColors[Math.min(level, horizontalColors.length - 1)];
      default: // hierarchical
        const colors = [
          "#1e40af",
          "#059669",
          "#dc2626",
          "#ca8a04",
          "#6366f1",
          "#64748b",
        ];
        return colors[Math.min(level, colors.length - 1)];
    }
  };

  // Get node size based on style
  const getNodeSize = () => {
    switch (style) {
      case "compact":
        return "min-w-[180px] max-w-[200px]";
      case "mindmap":
        return "min-w-[160px] max-w-[180px]";
      case "radial":
        return "min-w-[200px] max-w-[220px]";
      default:
        return "min-w-[220px] max-w-[240px]";
    }
  };

  // Get border style based on chart style
  const getBorderStyle = () => {
    switch (style) {
      case "mindmap":
        return "rounded-full border-2";
      case "compact":
        return "rounded-sm border-2";
      case "radial":
        return "rounded-lg border-2";
      default:
        return "rounded-lg border-2";
    }
  };

  // Get display names based on language preference
  const getDisplayName = (org: IOrganizationStructure) => {
    if (isArabic) {
      return (
        org.organization_arb || org.organization_eng || t("common.notAvailable")
      );
    }
    return (
      org.organization_eng || org.organization_arb || t("common.notAvailable")
    );
  };

  const getSecondaryName = (org: IOrganizationStructure) => {
    if (isArabic) {
      return org.organization_eng || "";
    }
    return org.organization_arb || "";
  };

  const getOrganizationTypeName = (orgType: any) => {
    if (!orgType) return "";
    if (isArabic) {
      return (
        orgType.organization_type_arb || orgType.organization_type_eng || ""
      );
    }
    return orgType.organization_type_eng || orgType.organization_type_arb || "";
  };

  const getLocationName = (location: any) => {
    if (!location) return "";
    if (isArabic) {
      return location.location_arb || location.location_eng || "";
    }
    return location.location_eng || location.location_arb || "";
  };

  const hasChildren = organization.children && organization.children.length > 0;
  const isNotRoot = level > 0;

  return (
    <div className="relative">
      {/* Top Handle - for incoming connections (except root) */}
      {isNotRoot && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{
            background: getNodeColor(level),
            width: 12,
            height: 12,
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      )}

      {/* Left Handle - for horizontal layouts */}
      {style === "horizontal" && (
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{
            background: getNodeColor(level),
            width: 10,
            height: 10,
            border: "2px solid white",
          }}
        />
      )}

      {/* Right Handle - for horizontal layouts */}
      {style === "horizontal" && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{
            background: getNodeColor(level),
            width: 10,
            height: 10,
            border: "2px solid white",
          }}
        />
      )}

      <div
        className={`${getNodeSize()} p-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-white ${getBorderStyle()} ${
          isArabic ? "text-right font-arabic" : "text-left"
        }`}
        style={{ borderColor: getNodeColor(level) }}
      >
        <div
          className="p-1 rounded-t-md"
          style={{ backgroundColor: `${getNodeColor(level)}28` }}
        >
          <div
            className={`flex items-center gap-1.5 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <Building2 size={12} style={{ color: getNodeColor(level) }} />
            <h3
              className={`text-[11px] p-0 font-semibold truncate leading-tight ${
                isArabic ? "font-arabic" : ""
              }`}
            >
              {getDisplayName(organization)}
            </h3>
          </div>
          {getSecondaryName(organization) && (
            <p
              className={`text-[9px] text-muted-foreground truncate mt-0.5 ${
                isArabic ? "font-arabic" : ""
              }`}
            >
              {getSecondaryName(organization)}
            </p>
          )}
        </div>
        <div className="px-2 py-1 space-y-1">
          <div
            className={`flex items-center justify-between ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
              {organization.organization_code}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[9px] px-1 py-0 h-4"
              style={{
                backgroundColor: `${getNodeColor(level)}20`,
                color: getNodeColor(level),
              }}
            >
              {t("common.level")}
              {level + 1}
            </Badge>
          </div>

          {organization.organization_types && (
            <div
              className={`flex items-center gap-1 text-[9px] text-muted-foreground ${
                isArabic ? "flex-row-reverse" : ""
              }`}
            >
              <Users className="h-2 w-2 flex-shrink-0" />
              <span className="truncate">
                {getOrganizationTypeName(organization.organization_types)}
              </span>
            </div>
          )}

          {organization.locations && (
            <div
              className={`flex items-center gap-1 text-[9px] text-muted-foreground ${
                isArabic ? "flex-row-reverse" : ""
              }`}
            >
              <MapPin className="h-2 w-2 flex-shrink-0" />
              <span className="truncate">
                {getLocationName(organization.locations)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Handle - for outgoing connections (if has children) */}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{
            background: getNodeColor(level),
            width: 12,
            height: 12,
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  organizationNode: OrganizationNode,
};

interface OrganizationChartProps {
  data: IOrganizationStructure[];
  style?: ChartStyle;
}

export const OrganizationChart: React.FC<OrganizationChartProps> = ({
  data,
  style = "hierarchical",
}) => {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();
  const isArabic = currentLocale === "ar";

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Layout parameters based on style
    const getLayoutParams = () => {
      switch (style) {
        case "hierarchical":
          return {
            VERTICAL_SPACING: 180,
            BASE_HORIZONTAL_SPACING: 280,
            connectionType: ConnectionLineType.SmoothStep,
          };
        case "radial":
          return {
            RADIUS_INCREMENT: 200,
            BASE_RADIUS: 150,
            connectionType: ConnectionLineType.Straight,
          };
        case "horizontal":
          return {
            HORIZONTAL_SPACING: 300,
            BASE_VERTICAL_SPACING: 120,
            connectionType: ConnectionLineType.SmoothStep,
          };
        case "compact":
          return {
            VERTICAL_SPACING: 120,
            BASE_HORIZONTAL_SPACING: 200,
            connectionType: ConnectionLineType.Step,
          };
        case "mindmap":
          return {
            BRANCH_LENGTH: 250,
            ANGLE_INCREMENT: 60,
            connectionType: ConnectionLineType.Bezier,
          };
        default:
          return {
            VERTICAL_SPACING: 180,
            BASE_HORIZONTAL_SPACING: 280,
            connectionType: ConnectionLineType.SmoothStep,
          };
      }
    };

    const layoutParams = getLayoutParams();

    // Calculate subtree width for hierarchical layouts
    const calculateSubtreeWidth = (org: IOrganizationStructure): number => {
      if (!org.children || org.children.length === 0) {
        return 1;
      }
      const childrenWidth = org.children.reduce(
        (sum, child) => sum + calculateSubtreeWidth(child),
        0
      );
      return Math.max(1, childrenWidth);
    };

    // Hierarchical Layout (original)
    const processHierarchicalNode = (
      org: IOrganizationStructure,
      level: number = 0,
      parentX: number = 0,
      availableWidth: number = 1000,
      offsetX: number = 0
    ): number => {
      const currentSubtreeWidth = calculateSubtreeWidth(org);
      const nodeX = parentX + offsetX;
      const y = level * (layoutParams.VERTICAL_SPACING || 180);

      const nodeId = org.organization_id.toString();
      const node: Node = {
        id: nodeId,
        type: "organizationNode",
        position: { x: nodeX, y },
        data: { organization: org, level, style },
        draggable: false,
        selectable: true,
      };

      nodes.push(node);

      if (org.children && org.children.length > 0) {
        const totalChildrenWidth = org.children.reduce(
          (sum, child) => sum + calculateSubtreeWidth(child),
          0
        );
        const childSpacing = Math.max(
          layoutParams.BASE_HORIZONTAL_SPACING || 280,
          availableWidth / Math.max(totalChildrenWidth, 1)
        );
        const startX = nodeX - ((totalChildrenWidth - 1) * childSpacing) / 2;

        let currentChildX = startX;

        org.children.forEach((child, _index) => {
          const childSubtreeWidth = calculateSubtreeWidth(child);
          const childCenterOffset =
            ((childSubtreeWidth - 1) * childSpacing) / 2;
          const childX = currentChildX + childCenterOffset;

          const edgeId = `edge-${org.organization_id}-to-${child.organization_id}`;
          const edge: Edge = {
            id: edgeId,
            source: nodeId,
            target: child.organization_id.toString(),
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "default",
            animated: false,
            style: {
              strokeWidth: 2.5,
              stroke: "#4f46e5",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 14,
              height: 14,
              color: "#4f46e5",
            },
          };

          edges.push(edge);
          processHierarchicalNode(
            child,
            level + 1,
            childX,
            childSpacing * childSubtreeWidth,
            0
          );
          currentChildX += childSubtreeWidth * childSpacing;
        });
      }

      return currentSubtreeWidth;
    };

    // Radial Layout
    const processRadialNode = (
      org: IOrganizationStructure,
      level: number = 0,
      angle: number = 0,
      radius: number = 0,
      _parentAngle?: number
    ) => {
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const nodeId = org.organization_id.toString();
      const node: Node = {
        id: nodeId,
        type: "organizationNode",
        position: { x, y },
        data: { organization: org, level, style },
        draggable: true,
        selectable: true,
      };

      nodes.push(node);

      if (org.children && org.children.length > 0) {
        const childRadius = radius + (layoutParams.RADIUS_INCREMENT || 200);
        const angleSpread = level === 0 ? Math.PI * 1.5 : Math.PI / 1.5;
        const angleStep = angleSpread / Math.max(org.children.length, 1);
        const startAngle = angle - angleSpread / 2;

        org.children.forEach((child, index) => {
          const childAngle = startAngle + angleStep * index;

          const edgeId = `edge-${org.organization_id}-to-${child.organization_id}`;
          const edge: Edge = {
            id: edgeId,
            source: nodeId,
            target: child.organization_id.toString(),
            type: "straight",
            animated: false,
            style: {
              strokeWidth: 2,
              stroke: "#10b981",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: "#10b981",
            },
          };

          edges.push(edge);
          processRadialNode(child, level + 1, childAngle, childRadius);
        });
      }
    };

    // Horizontal Layout
    const processHorizontalNode = (
      org: IOrganizationStructure,
      level: number = 0,
      parentY: number = 0,
      availableHeight: number = 600,
      offsetY: number = 0
    ): number => {
      const currentSubtreeHeight = calculateSubtreeWidth(org);
      const nodeY = parentY + offsetY;
      const x = level * (layoutParams.HORIZONTAL_SPACING || 300);

      const nodeId = org.organization_id.toString();
      const node: Node = {
        id: nodeId,
        type: "organizationNode",
        position: { x, y: nodeY },
        data: { organization: org, level, style },
        draggable: false,
        selectable: true,
      };

      nodes.push(node);

      if (org.children && org.children.length > 0) {
        const totalChildrenHeight = org.children.reduce(
          (sum, child) => sum + calculateSubtreeWidth(child),
          0
        );
        const childSpacing = Math.max(
          layoutParams.BASE_VERTICAL_SPACING || 120,
          availableHeight / Math.max(totalChildrenHeight, 1)
        );
        const startY = nodeY - ((totalChildrenHeight - 1) * childSpacing) / 2;

        let currentChildY = startY;

        org.children.forEach((child, _index) => {
          const childSubtreeHeight = calculateSubtreeWidth(child);
          const childCenterOffset =
            ((childSubtreeHeight - 1) * childSpacing) / 2;
          const childY = currentChildY + childCenterOffset;

          const edgeId = `edge-${org.organization_id}-to-${child.organization_id}`;
          const edge: Edge = {
            id: edgeId,
            source: nodeId,
            target: child.organization_id.toString(),
            sourceHandle: "right",
            targetHandle: "left",
            type: "smoothstep",
            animated: false,
            style: {
              strokeWidth: 2.5,
              stroke: "#7c3aed",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 14,
              height: 14,
              color: "#7c3aed",
            },
          };

          edges.push(edge);
          processHorizontalNode(
            child,
            level + 1,
            childY,
            childSpacing * childSubtreeHeight,
            0
          );
          currentChildY += childSubtreeHeight * childSpacing;
        });
      }

      return currentSubtreeHeight;
    };

    // Compact Grid Layout
    const processCompactNode = (
      org: IOrganizationStructure,
      level: number = 0,
      parentX: number = 0,
      availableWidth: number = 800,
      offsetX: number = 0
    ): number => {
      const currentSubtreeWidth = calculateSubtreeWidth(org);
      const nodeX = parentX + offsetX;
      const y = level * (layoutParams.VERTICAL_SPACING || 120);

      const nodeId = org.organization_id.toString();
      const node: Node = {
        id: nodeId,
        type: "organizationNode",
        position: { x: nodeX, y },
        data: { organization: org, level, style },
        draggable: false,
        selectable: true,
      };

      nodes.push(node);

      if (org.children && org.children.length > 0) {
        const totalChildrenWidth = org.children.reduce(
          (sum, child) => sum + calculateSubtreeWidth(child),
          0
        );
        const childSpacing = Math.max(
          layoutParams.BASE_HORIZONTAL_SPACING || 200,
          availableWidth / Math.max(totalChildrenWidth, 1)
        );
        const startX = nodeX - ((totalChildrenWidth - 1) * childSpacing) / 2;

        let currentChildX = startX;

        org.children.forEach((child, _index) => {
          const childSubtreeWidth = calculateSubtreeWidth(child);
          const childCenterOffset =
            ((childSubtreeWidth - 1) * childSpacing) / 2;
          const childX = currentChildX + childCenterOffset;

          const edgeId = `edge-${org.organization_id}-to-${child.organization_id}`;
          const edgeColor = `hsl(${210 + level * 20}, 60%, ${60 - level * 5}%)`;
          const edge: Edge = {
            id: edgeId,
            source: nodeId,
            target: child.organization_id.toString(),
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "step",
            animated: false,
            style: {
              strokeWidth: 2,
              stroke: edgeColor,
              strokeDasharray: "3,3",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
              color: edgeColor,
            },
          };

          edges.push(edge);
          processCompactNode(
            child,
            level + 1,
            childX,
            childSpacing * childSubtreeWidth,
            0
          );
          currentChildX += childSubtreeWidth * childSpacing;
        });
      }

      return currentSubtreeWidth;
    };

    // Mind Map Layout
    const processMindMapNode = (
      org: IOrganizationStructure,
      level: number = 0,
      angle: number = 0,
      distance: number = 0,
      isRoot: boolean = false
    ) => {
      let x, y;

      if (isRoot) {
        x = 0;
        y = 0;
      } else {
        x = distance * Math.cos(angle);
        y = distance * Math.sin(angle);
      }

      const nodeId = org.organization_id.toString();
      const node: Node = {
        id: nodeId,
        type: "organizationNode",
        position: { x, y },
        data: { organization: org, level, style },
        draggable: false,
        selectable: true,
      };

      nodes.push(node);

      if (org.children && org.children.length > 0) {
        const childDistance = distance + (layoutParams.BRANCH_LENGTH || 250);
        // More organic spread for mindmap
        const angleSpread = level === 0 ? Math.PI * 1.5 : Math.PI / 2;
        const angleStep =
          org.children.length > 1
            ? angleSpread / (org.children.length - 1)
            : angleSpread / 2;
        const startAngle = angle - angleSpread / 2;

        org.children.forEach((child, index) => {
          const childAngle =
            org.children.length === 1 ? angle : startAngle + angleStep * index;

          const edgeId = `edge-${org.organization_id}-to-${child.organization_id}`;
          const edgeColor = `hsl(${(level * 60 + index * 30) % 360}, 70%, 50%)`;
          const edge: Edge = {
            id: edgeId,
            source: nodeId,
            target: child.organization_id.toString(),
            type: "bezier",
            animated: false,
            style: {
              strokeWidth: Math.max(2, 4 - level * 0.5),
              stroke: edgeColor,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: edgeColor,
            },
          };

          edges.push(edge);
          processMindMapNode(
            child,
            level + 1,
            childAngle,
            childDistance,
            false
          );
        });
      }
    };

    // Process based on selected style
    if (data.length === 0) return { nodes, edges };

    switch (style) {
      case "radial":
        if (data.length === 1) {
          processRadialNode(data[0], 0, 0, 0);
        } else {
          const angleStep = (2 * Math.PI) / data.length;
          data.forEach((rootOrg, index) => {
            const angle = angleStep * index;
            processRadialNode(
              rootOrg,
              0,
              angle,
              layoutParams.BASE_RADIUS || 150
            );
          });
        }
        break;

      case "horizontal":
        if (data.length === 1) {
          processHorizontalNode(data[0], 0, 0, 600, 0);
        } else {
          let currentY = -(data.length - 1) * 150;
          data.forEach((rootOrg) => {
            processHorizontalNode(rootOrg, 0, currentY, 300, 0);
            currentY += 300;
          });
        }
        break;

      case "compact":
        if (data.length === 1) {
          processCompactNode(data[0], 0, 0, 800, 0);
        } else {
          const totalRootWidth = data.reduce(
            (sum, org) => sum + calculateSubtreeWidth(org),
            0
          );
          const rootSpacing = Math.max(
            layoutParams.BASE_HORIZONTAL_SPACING || 200,
            800 / totalRootWidth
          );
          let currentRootX = (-(totalRootWidth - 1) * rootSpacing) / 2;

          data.forEach((rootOrg) => {
            const rootSubtreeWidth = calculateSubtreeWidth(rootOrg);
            const rootCenterOffset = ((rootSubtreeWidth - 1) * rootSpacing) / 2;
            const rootX = currentRootX + rootCenterOffset;

            processCompactNode(
              rootOrg,
              0,
              rootX,
              rootSpacing * rootSubtreeWidth,
              0
            );
            currentRootX += rootSubtreeWidth * rootSpacing;
          });
        }
        break;

      case "mindmap":
        if (data.length === 1) {
          processMindMapNode(data[0], 0, 0, 0, true);
        } else {
          const angleStep = (2 * Math.PI) / data.length;
          data.forEach((rootOrg, index) => {
            const angle = angleStep * index;
            processMindMapNode(
              rootOrg,
              0,
              angle,
              layoutParams.BRANCH_LENGTH || 250,
              false
            );
          });
        }
        break;

      case "hierarchical":
      default:
        if (data.length === 1) {
          processHierarchicalNode(data[0], 0, 0, 1000, 0);
        } else {
          const totalRootWidth = data.reduce(
            (sum, org) => sum + calculateSubtreeWidth(org),
            0
          );
          const rootSpacing = Math.max(
            (layoutParams.BASE_HORIZONTAL_SPACING || 280) * 2,
            1000 / totalRootWidth
          );
          let currentRootX = (-(totalRootWidth - 1) * rootSpacing) / 2;

          data.forEach((rootOrg) => {
            const rootSubtreeWidth = calculateSubtreeWidth(rootOrg);
            const rootCenterOffset = ((rootSubtreeWidth - 1) * rootSpacing) / 2;
            const rootX = currentRootX + rootCenterOffset;

            processHierarchicalNode(
              rootOrg,
              0,
              rootX,
              rootSpacing * rootSubtreeWidth,
              0
            );
            currentRootX += rootSubtreeWidth * rootSpacing;
          });
        }
        break;
    }

    console.log(
      `Generated ${nodes.length} nodes and ${edges.length} edges for ${style} style`
    );
    return { nodes, edges };
  }, [data, style]); // Removed unnecessary currentLocale dependency

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Force update nodes and edges when layout changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Get connection type for current style
  const getConnectionType = () => {
    switch (style) {
      case "hierarchical":
        return ConnectionLineType.SmoothStep;
      case "radial":
        return ConnectionLineType.Straight;
      case "horizontal":
        return ConnectionLineType.SmoothStep;
      case "compact":
        return ConnectionLineType.Step;
      case "mindmap":
        return ConnectionLineType.Bezier;
      default:
        return ConnectionLineType.SmoothStep;
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {t("common.noDataFound")}
      </div>
    );
  }

  return (
    <div
      className={`w-full h-[650px] ${isArabic ? "rtl" : "ltr"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <ReactFlow
        key={`chart-${style}`} // Stable key based only on style
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 100,
          includeHiddenNodes: false,
          minZoom: 0.2,
          maxZoom: 1.2,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        // attributionPosition="bottom-left"
        className="bg-background"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        minZoom={0.2}
        maxZoom={1.5}
        connectionLineType={getConnectionType()}
      >
        <Controls
          className="bg-background border shadow-md"
          showInteractive={false}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={50}
          size={1}
        />
      </ReactFlow>
    </div>
  );
};

export const chartStyleOptions: ChartStyleOption[] = [
  {
    value: "hierarchical",
    label: "Hierarchical",
    description: "Traditional top-down organizational chart",
  },
  {
    value: "radial",
    label: "Radial",
    description: "Circular layout with center root",
  },
  {
    value: "horizontal",
    label: "Horizontal",
    description: "Left-to-right tree layout",
  },
  {
    value: "compact",
    label: "Compact",
    description: "Space-efficient grid layout",
  },
  {
    value: "mindmap",
    label: "Mind Map",
    description: "Creative branching layout with colors",
  },
];

export default OrganizationChart;
