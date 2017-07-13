import {SNodeSchema} from "../../../src/graph/sgraph";
import {Property} from "jsonforms";

export interface JsonGraphNodeSchema extends SNodeSchema {
  data?: any
  prop?: Property
}