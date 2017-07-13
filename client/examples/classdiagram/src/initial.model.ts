
// Initialize model
import {SEdge} from "../../../src/graph/sgraph";

export const node0 = {
  id: 'node0',
  type: 'node:class',
  position: {
    x: 100,
    y: 100
  },
  layout: 'vbox',
  children: [
    {
      id: 'node0_classname',
      type: 'label:heading',
      text: 'Foo'
    },
    {
      id: 'node0_attrs',
      type: 'comp:comp',
      layout: 'vbox',
      children: [
        {
          id: 'node0_op2',
          type: 'label:text',
          text: 'name: string'
        }
      ],
    },
    {
      id: 'node0_ops',
      type: 'comp:comp',
      layout: 'vbox',
      children: [
        {
          id: 'node0_op0',
          type: 'label:text',
          text: '+ foo(): integer'
        }, {
          id: 'node0_op1',
          type: 'label:text',
          text: '# bar(x: string): void'
        }
      ],
    }
  ]
};

export const node1 = {
  id: 'node1',
  type: 'node:class',
  position: {
    x: 500,
    y: 200
  },
  layout: 'vbox',
  children: [
    {
      id: 'node1_classname',
      type: 'label:heading',
      text: 'Bar'
    },
    {
      id: 'node1_attrs',
      type: 'comp:comp',
      layout: 'vbox',
      children: [
        {
          id: 'node1_op2',
          type: 'label:text',
          text: 'name: string'
        }
      ],
    },
    {
      id: 'node1_ops',
      type: 'comp:comp',
      layout: 'vbox',
      children: [
        {
          id: 'node1_op0',
          type: 'label:text',
          text: '+ foo(): Foo'
        }

      ],
    }
  ]
};

export const edge = {
  id: 'edge',
  type: 'edge:straight',
  sourceId: node0.id,
  targetId: node1.id
} as SEdge;