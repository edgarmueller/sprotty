import * as _ from 'lodash';
import {Property, SchemaService} from "jsonforms"
import {SEdge, SGraph, SLabel, SShapeElement} from "../../../src/graph/sgraph"
import {SModelRoot} from "../../../src/base/model/smodel";
import {SNode} from "../../../src/index";
import {JsonGraphNodeSchema} from "./model";

export interface RuntimeDiagram {
  data: object
  schemaService: SchemaService
  dangling: Array<object>
  configuration: DiagramConfiguration
  graph?: SGraph
  dataToNode: Map<object, SNode>
}

export interface DiagramConfiguration {
  // empty
}

let ID = 0;
export const createNode = (
  data: any,
  x: number,
  y: number,
  prop: Property,
): SNode => {
  const id = ID++;
  // create programmatically in order to initialize defaults
  const node: any = new SNode();
  node.type = 'node:class';
  node.id = `node${id}`;
  node.position = {
    x,
    y
  };
  node.data = data;
  node.layout = 'vbox';
  node.children = [{
    id: `node${id}_classname`,
    type: 'label:heading',
    text: data.name,
    prop,
  }];
  return node;
};


const createNodes = (
  diagram: RuntimeDiagram,
  data: object,
  property: Property,
  x: number,
  y: number,
  visited: object[]
): SShapeElement[] => {

  const node = createNode(data, x, y, property);
  diagram.dataToNode.set(data, node);

  if (visited.indexOf(data) !== -1) {
    return [];
  }

  // object.children
  return [node as SShapeElement].concat(createObjectAndChildren(
    diagram,
    node,
    property,
    data,
    visited
  ))
};

const findNodeByData = (diagram: RuntimeDiagram, data: object): JsonGraphNodeSchema => {
  return diagram.dataToNode.get(data);
};

export function createObjectAndChildren(
  diagram: RuntimeDiagram,
  parentNode: SNode,
  property: Property,
  data: Object,
  visitedObjects: Object[],
): SShapeElement[] {

  const x = parentNode.position.x;
  const y = parentNode.position.y;
  const childY = y + 200;
  let childX = x;
  let ownChildren = 0;
  let maxChildren = 0;

  const containmentProperties = diagram.schemaService.getContainmentProperties(property.schema);

  return _.flatMap(containmentProperties, containmentProperty => {

    const children = containmentProperty.getData(data);

    if (children === undefined || !Array.isArray(children)) {
      return
    }

    const unvisitedChildren = _.filter(
      children,
      child => _.find(visitedObjects, child) === undefined
    );

    return _.flatMap(unvisitedChildren, child => {

      childX = x + (maxChildren * 120);
      childX += 120;
      ownChildren++;
      maxChildren = Math.max(maxChildren, ownChildren);
      visitedObjects.push(child);

      const node = createNode(child, childX, childY, containmentProperty);

      // create edge from parent to child
      const edge: SEdge = {
        id: `edge${ID++}`,
        type: 'edge:straight',
        sourceId: parentNode.id,
        targetId: node.id,
      } as SEdge;


      diagram.dataToNode.set(child, node);
      child.parent = parentNode;

      return [node, edge];
    })
  });
}

const createEdges = (
  diagram: RuntimeDiagram,
  data: Object,
  property: Property,
  edges: SEdge[]
): SEdge[] => {

  const containmentProperties = diagram.schemaService.getContainmentProperties(property.schema);

  containmentProperties.forEach(containmentProperty => {

    let children = containmentProperty.getData(data);

    if (children === undefined) {
      return
    }

    if (!Array.isArray(children)) {
      children = [children]
    }

    const parent = findNodeByData(diagram, data);
    const parentChildren = parent.children;

    if (parentChildren === undefined || parentChildren === undefined) {
      return;
    }

    (children as Array<any>).forEach((child, index) => {
      const referenceProperties =
        diagram.schemaService.getReferenceProperties(containmentProperty.schema);


      if (referenceProperties.length !== 0) {

        referenceProperties.forEach((referenceProperty) => {
          const childNode = findNodeByData(diagram, referenceProperty.getData(diagram.data, child));

          if (childNode) {
            const edge: SEdge = {
              id: `edge${ID++}`,
              type: 'edge:straight',
              sourceId: childNode.id,
              targetId: parent.id,
            } as SEdge;
            edges.push(edge)
          } else {
            // add as prop instead
            if (!_.find(parentChildren, child => child.id === `${parent.id}_ops`)) {
              parentChildren.push({
                id: `${parent.id}_ops`,
                type: 'comp:comp',
                layout: 'vbox',
                children: []
              });
            }

            const attrs = parentChildren[1] as JsonGraphNodeSchema;

            const label = new SLabel();
            label.id = `${parent.id}_prop_${index}`;
            label.type = 'label:text';
            label.text = `+ ${child.name}`;
            // const classProps = parent.children[1];
            if (attrs.children && _.find(attrs.children, child => child.id === label.id) === undefined) {
              attrs.children.push(label);
            }
          }
        })
      } else {
        edges.concat(createEdges(diagram, child, containmentProperty, edges));
      }
    })
  });

  return edges;
};

export const createGraph = (
  data: Object,
  rootProperty: Property,
  schemaService: SchemaService,
  diagramConfiguration?: DiagramConfiguration
): SModelRoot => {

  const diagram = {
    data,
    schemaService,
    dangling: [],
    configuration: diagramConfiguration,
    dataToNode: new Map()
  } as RuntimeDiagram;

  const root = new SModelRoot();
  root.id = 'graph';
  root.type = 'graph';
  const nodes = createNodes(diagram, data, rootProperty, 100, 100, []);
  const edges = createEdges(diagram, data, rootProperty, []);
  nodes.forEach(child => root.add(child));
  edges.forEach(child => root.add(child));
  return root;
};