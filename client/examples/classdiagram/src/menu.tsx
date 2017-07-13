import {VNode} from "snabbdom/vnode"
import * as snabbdomJsx from 'snabbdom-jsx';
import {JsonSchema, SchemaService} from "jsonforms";
import {SModelRoot} from "../../../src/base/model/smodel";
import {createNode} from "./graph";
import {LocalModelSource} from "../../../src/model-source/local-model-source";

const JSX = {createElement: snabbdomJsx.html};

const randomX = () => Math.floor(Math.random() * 750);
const randomY = () => Math.floor(Math.random() * 500);

export const createMenu = (
  schemaService: SchemaService,
  schema: JsonSchema,
  modelSource: LocalModelSource,
  graph: SModelRoot): VNode => {

  const props = schemaService.getContainmentProperties(schema);
  return (
    <span>
      {
        props.map(prop =>
          <button type="button" onclick={() => {
            const node = createNode(
              {
                name: prop.label
              },
              randomX(),
              randomY(),
              prop
            );
            graph.add(node);
            modelSource.updateModel(graph);
          }}>
            Add {prop.label}
          </button>
        )
      }
    </span>
  );
};
