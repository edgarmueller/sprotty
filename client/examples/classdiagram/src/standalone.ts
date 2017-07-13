/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as _ from "lodash";
import * as snabbdom from 'snabbdom';
import classModule from 'snabbdom/modules/class';
import propsModule from 'snabbdom/modules/props';
import styleModule from 'snabbdom/modules/style';
import eventListenersModule from 'snabbdom/modules/eventlisteners';

import {LocalModelSource, TYPES} from "../../../src"
import createContainer from "./di.config"
import {examplePackage} from './ecore.data'
import {ecoreSchema} from './ecore.schema'
import {createGraph} from "./graph"
import {ContainmentProperty, JsonFormsElement, Property, SchemaServiceImpl} from "jsonforms"

import {createMenu} from "./menu";

import {ActionHandlerRegistry, IActionHandler} from "../../../src/base/actions/action-handler";
import {SelectAction, SelectCommand} from "../../../src/features/select/select";
import {SModelRootSchema} from "../../../src/base/model/smodel";
import {JsonGraphNodeSchema} from "./model";

// Init patch function with chosen modules
const patch = snabbdom.init([
  classModule,          // makes it easy to toggle classes
  propsModule,          // for setting properties on DOM elements
  styleModule,          // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

export default function runClassDiagram() {

  const container = createContainer(false, 'sprotty');

   const rootProp: Property = {
    schema: ecoreSchema,
    property: '',
    label: 'root'
  };

  const schemaService = new SchemaServiceImpl(ecoreSchema);

  // create graph --
  const graph = createGraph(
    examplePackage,
    rootProp,
    schemaService
  );

  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

  // create menu --
  const menu = createMenu(schemaService, ecoreSchema, modelSource, graph);
  const divMenu = document.getElementById("menu");
  if (divMenu) {
    patch(divMenu, menu);
  }

  // register selection handler --
  const registry = container.get<ActionHandlerRegistry>(TYPES.ActionHandlerRegistry);
  registry.register(SelectCommand.KIND, new CommandActionHandler(graph));

  // init model --
  modelSource.setModel(graph)
}

export class CommandActionHandler implements IActionHandler {

  constructor(private graph: SModelRootSchema) {
  }

  handle(action: SelectAction): void {
    const id = _.first(action.selectedElementsIDs);
    const node = this.findById(this.graph.children as JsonGraphNodeSchema[], id);
    if (node && node.children) {
      const prop = _.first(node.children as JsonGraphNodeSchema[]).prop;
      if (prop !== undefined) {
        this.renderJsonForms(prop, node.data);
      }
    }
  }

  findById(children: JsonGraphNodeSchema[], id: string): JsonGraphNodeSchema {
    return _.find(children, child => child.id === id)
  }

  renderJsonForms(prop: ContainmentProperty, propData: any) {
    const jsonForms = document.createElement("json-forms") as JsonFormsElement;
    jsonForms.dataSchema = prop.schema;
    jsonForms.data = propData;
    jsonForms.id = "props";
    const parent = document.getElementById("props-parent");
    const props = document.getElementById("props");
    if (parent && props) {
      parent.replaceChild(jsonForms, props);
    }
  }
}

