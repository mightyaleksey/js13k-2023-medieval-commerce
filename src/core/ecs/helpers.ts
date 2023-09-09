import { Component } from '@/lib/ecs'
import {
  Clickable,
  Collidable,
  Draggable,
  FloorPoint,
  ItemsPhysics,
  Mov,
  Physical,
  Pos,
  Renderable,
  Resource,
  ResourceSource,
  ResourcesPrices,
  Sell
} from './component'
import { tileSizeUpscaled } from '../draw-engine'
import { Layers } from './systems/render'
import { CROP, I_AXE, I_PICKUP_HAND, I_TAPKA, P_SELL, TREE_BOTTOM, WELL_BOTTOM, WELL_TOP, convertResToSprite, resourcesSprites } from '@/tiles'

// helper functions to create entities
export const createObstacle = (
  [x, y]: [number, number],
  sprite: number,
  w = tileSizeUpscaled - 2, h = tileSizeUpscaled - 2,
  // FIXME remove angle is not used
  angle?: number
): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(sprite, Layers.Objects, angle),
    new Collidable({ w, h })
  ]
}

export const createMovingObstacle = (
  [x, y]: [number, number],
  sprite: number,
  mass = 1, friction = 0.1,
  w = tileSizeUpscaled - 2, h = tileSizeUpscaled - 2

): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(sprite, Layers.Objects),
    new Collidable({ w, h }),
    new Mov(),
    new Physical({ mass, friction }),
    new Draggable(),
    new Clickable(I_PICKUP_HAND)
  ]
}

export const createFloor = (
  [x, y]: [number, number],
  sprite: number,
  angle?: number
): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(sprite, Layers.Floor, angle)
  ]
}

export const createAlwaysOnTop = (
  [x, y]: [number, number],
  sprite: number
): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(sprite, Layers.AlwaysOnTop)
  ]
}

export const createFreight = (
  [x, y]: [number, number],
  resourceType: Resource = 'wood',
  w = tileSizeUpscaled - 8, h = tileSizeUpscaled - 8,
  physics?: {
    mass: number;
    friction: number;
  },
  price?: number
): Component[] => {
  if (!price) {
    price = ResourcesPrices[resourceType]
  }

  if (!physics) {
    // @ts-ignore
    physics = ItemsPhysics[resourceType]
  }

  // add price
  return [
    new Pos(x, y),
    new Renderable(convertResToSprite(resourceType), Layers.Objects),
    new Collidable({ w, h }),
    new Draggable(),
    new Clickable(I_PICKUP_HAND),
    new Mov(),
    new Physical({ mass: physics?.mass, friction: physics?.friction }),
    new Sell(resourceType, price)
  ]
}

export const createTree = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(TREE_BOTTOM, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }),
    new ResourceSource('wood', {}, 5000),
    new Clickable(I_AXE, true)
  ]
}

export const createWell = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(WELL_BOTTOM, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }),
    new ResourceSource('water', {}, 3000),
    new Clickable(resourcesSprites.water, true)
  ]
}

export const createCrop = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(CROP, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }),
    new ResourceSource('food', {}, 25000),
    new Clickable(I_TAPKA)
  ]
}

// Fixme rework it into ecs
// export const createSpawnPoint = (pos: DOMPoint): Component[] => {
//   return {
//     id: getId(),
//     pos,
//     sprite: SPAWN_POINT,
//     type: "spawnPoint",
//     layer: Layers.Points,
//     gameData: {
//       timers: {
//         nextSpawn: 3000,
//         spawnInterval: 5000,
//       },
//     },
//   };
// };

export const createSellPoint = ([x, y]: [number, number]): Component[] => {
  return [
    new Pos(x, y),
    new Renderable(P_SELL, Layers.Points),
    new FloorPoint('sellPoint'),
    new Sell('point')
  ]
}

// export const createModifiedFloor = (
//   pos: DOMPoint,
//   sprite: number,
//   type: "stairs" | "ice",
//   modifiers: Entity["physicsModifiers"]
// ): Component[] => {
//   return {
//     id: getId(),
//     pos,
//     sprite,
//     type: type,
//     layer: Layers.Floor,
//     physicsModifiers: modifiers,
//     gameData: {},
//   };
// };
