import { SParentElement } from '../..';
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import 'mocha';
import { expect } from "chai"
import { SModelElement } from '../../base/model/smodel'
import { SNode, SCompartmentElement } from '../../graph/sgraph'
import { StatefulLayouter, LayoutRegistry } from './layout'
import { BoundsData } from './hidden-bounds-updater'
import { EMPTY_DIMENSION } from '../../utils/geometry'
import { ConsoleLogger } from '../../utils/logging'
import { Dimension } from '../../utils/geometry'

describe('HBoxLayouter', () => {

    const log = new ConsoleLogger()

    const map = new Map<SModelElement, BoundsData>()

    function snode(size: Dimension): SNode {
        const node = new SNode()
        node.bounds = {
            x: 0, y: 0, width: size.width, height: size.height
        }
        return node
    }

    function addToMap(element: SModelElement) {
        map.set(element, {
            bounds: (element as any).bounds,
            boundsChanged: false,
            alignmentChanged: false
        })
        if (element instanceof SParentElement)
            element.children.forEach(c => addToMap(c))
    }

    function layout(model: SNode) {
        map.clear()
        addToMap(model)
        const layouter = new StatefulLayouter(map, new LayoutRegistry(), log)
        layouter.layout()
    }

    function createModel(): SNode {
        const model = snode(EMPTY_DIMENSION)
        model.children = [
            snode({ width: 1, height: 2 }),
            snode({ width: 2, height: 1 }),
            snode({ width: 3, height: 3 })
        ] as SCompartmentElement[]
        model.layout = 'hbox'
        return model
    }

    it('defaultParams', () => {
        const model = createModel()
        layout(model)
        expect(map.get(model)!.bounds).to.deep.equal({x: 0, y: 0, width: 18, height: 13})
        expect(map.get(model.children[0])!.bounds).to.deep.equal({x: 5, y: 5.5, width: 1, height: 2})
        expect(map.get(model.children[1])!.bounds).to.deep.equal({x: 7, y: 6, width: 2, height: 1})
        expect(map.get(model.children[2])!.bounds).to.deep.equal({x: 10, y: 5, width: 3, height: 3})
    })

    it('alignTop', () => {
        const model = createModel()
        model.layoutOptions = {
            vAlign: 'top'
        } 
        layout(model)
        expect(map.get(model)!.bounds).to.deep.equal({x: 0, y: 0, width: 18, height: 13})
        expect(map.get(model.children[0])!.bounds).to.deep.equal({x: 5, y: 5, width: 1, height: 2})
        expect(map.get(model.children[1])!.bounds).to.deep.equal({x: 7, y: 5, width: 2, height: 1})
        expect(map.get(model.children[2])!.bounds).to.deep.equal({x: 10, y: 5, width: 3, height: 3})
    })

    it('alignBottom', () => {
        const model = createModel()
        model.layoutOptions = {
            vAlign: 'bottom'
        } 
        layout(model)
        expect(map.get(model)!.bounds).to.deep.equal({x: 0, y: 0, width: 18, height: 13})
        expect(map.get(model.children[0])!.bounds).to.deep.equal({x: 5, y: 6, width: 1, height: 2})
        expect(map.get(model.children[1])!.bounds).to.deep.equal({x: 7, y: 7, width: 2, height: 1})
        expect(map.get(model.children[2])!.bounds).to.deep.equal({x: 10, y: 5, width: 3, height: 3})
    })

    it('padding', () => {
        const model = createModel()
        model.layoutOptions = {
            paddingTop: 7,
            paddingBottom: 8,
            paddingLeft: 9,
            paddingRight: 10 
        } 
        layout(model)
        expect(map.get(model)!.bounds).to.deep.equal({x: 0, y: 0, width: 27, height: 18})
        expect(map.get(model.children[0])!.bounds).to.deep.equal({x: 9, y: 7.5, width: 1, height: 2})
        expect(map.get(model.children[1])!.bounds).to.deep.equal({x: 11, y: 8, width: 2, height: 1})
        expect(map.get(model.children[2])!.bounds).to.deep.equal({x: 14, y: 7, width: 3, height: 3})
    })

    it('hGap', () => {
        const model = createModel()
        model.layoutOptions = {
            hGap: 4
        } 
        layout(model)
        expect(map.get(model)!.bounds).to.deep.equal({x: 0, y: 0, width: 24, height: 13})
        expect(map.get(model.children[0])!.bounds).to.deep.equal({x: 5, y: 5.5, width: 1, height: 2})
        expect(map.get(model.children[1])!.bounds).to.deep.equal({x: 10, y: 6, width: 2, height: 1})
        expect(map.get(model.children[2])!.bounds).to.deep.equal({x: 16, y: 5, width: 3, height: 3})
    })

    it('paddingFactor', () => {
        const model = createModel()
        model.layoutOptions = {
            paddingFactor: 2
        } 
        layout(model)
        expect(map.get(model)!.bounds).to.deep.equal({x: 0, y: 0, width: 26, height: 16})
        expect(map.get(model.children[0])!.bounds).to.deep.equal({x: 9, y: 7, width: 1, height: 2})
        expect(map.get(model.children[1])!.bounds).to.deep.equal({x: 11, y: 7.5, width: 2, height: 1})
        expect(map.get(model.children[2])!.bounds).to.deep.equal({x: 14, y: 6.5, width: 3, height: 3})
    })
})


