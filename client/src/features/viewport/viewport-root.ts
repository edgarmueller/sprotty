/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { Bounds, Point, isBounds, isValidDimension } from "../../utils/geometry"
import { SModelRoot } from "../../base/model/smodel"
import { Viewport, viewportFeature } from "./model"
import { Exportable, exportFeature } from "../export/model"

export class ViewportRootElement extends SModelRoot implements Viewport, Exportable {
    scroll: Point = { x: 0, y: 0 }
    zoom: number = 1
    export: boolean = false

    hasFeature(feature: symbol) {
        return feature === viewportFeature || feature === exportFeature
    }

    localToParent(point: Point | Bounds): Bounds {
        const result = {
            x: (point.x - this.scroll.x) * this.zoom,
            y: (point.y - this.scroll.y) * this.zoom,
            width: -1,
            height: -1
        }
        if (isBounds(point)) {
            result.width = point.width * this.zoom
            result.height = point.height * this.zoom
        }
        return result
    }

    parentToLocal(point: Point | Bounds): Bounds {
        const result = {
            x: (point.x / this.zoom) + this.scroll.x,
            y: (point.y / this.zoom) + this.scroll.y,
            width: -1,
            height: -1
        }
        if (isBounds(point) && isValidDimension(point)) {
            result.width = point.width / this.zoom
            result.height = point.height / this.zoom
        }
        return result
    }
}