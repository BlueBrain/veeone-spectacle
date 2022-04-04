import { SpectaclePresentation } from "../types"
import { ContentBlockTypes } from "../../contentblocks/types"
import { resizePresentationStore } from "./resizing"
import { globalConfig } from "../../config"

describe("resizing", () => {
  const config = { ...globalConfig }
  const oldPresentation: SpectaclePresentation = {
    id: "test",
    meta: { viewport: { width: 1000, height: 600 } },
    name: "test presentation",
    savedAt: null,
    createdAt: null,
    updatedAt: null,
    scenes: {
      scenes: {
        sceneA: {
          frames: {
            frameAA: {
              type: ContentBlockTypes.Dummy,
              situation: {
                left: 100,
                top: 100,
                width: 400,
                height: 300,
                angle: 0,
              },
              data: {},
            },
            frameAB: {
              type: ContentBlockTypes.Dummy,
              situation: {
                left: 800,
                top: 100,
                width: 200,
                height: 500,
                angle: 0,
              },
              data: {},
            },
          },
          frameStack: ["frameAA", "frameAB"],
        },
        sceneB: {
          frames: {
            frameBA: {
              type: ContentBlockTypes.Dummy,
              situation: {
                left: 100,
                top: 100,
                width: 400,
                height: 300,
                angle: 0,
              },
              data: {},
            },
          },
          frameStack: ["frameBA"],
        },
        sceneC: {
          frames: {},
          frameStack: [],
        },
      },
      sceneOrder: ["sceneA", "sceneB", "sceneC"],
      activeScene: "sceneA",
    },
  }

  it("scales proportionally", () => {
    const newPresentation = resizePresentationStore(
      oldPresentation,
      {
        // Same aspect ratio
        width: 2000,
        height: 1200,
      },
      600,
      800,
      { width: 600, height: 600 }
    )
    const frameAA = newPresentation.scenes.scenes.sceneA.frames.frameAA

    expect(newPresentation.meta.viewport.width).toEqual(2000)
    expect(newPresentation.meta.viewport.height).toEqual(1200)
    expect(frameAA.situation.width).toEqual(800)
    expect(frameAA.situation.height).toEqual(600)
    expect(frameAA.situation.left).toEqual(200)
    expect(frameAA.situation.top).toEqual(200)
  })

  it("scales horizontally", () => {
    const newPresentation = resizePresentationStore(
      oldPresentation,
      {
        width: 3000,
        height: 1200,
      },
      600,
      800,
      { width: 600, height: 600 }
    )
    const frameAA = newPresentation.scenes.scenes.sceneA.frames.frameAA

    expect(newPresentation.meta.viewport.width).toEqual(3000)
    expect(newPresentation.meta.viewport.height).toEqual(1200)
    expect(frameAA.situation.width).toEqual(800)
    expect(frameAA.situation.height).toEqual(600)

    // We only increase width 1000 -> 2000, but height stays the same,
    // so we gained extra 1000px horizontal margin which we divide into both left and right spaces
    // thus the expected left position should change from 100 to 600px (100 + ((2000-1000)/2)
    expect(frameAA.situation.left).toEqual(700)

    // Since the height of new viewport has not changed we don't expect
    // vertical positions to be modified
    expect(frameAA.situation.top).toEqual(200)
  })

  it("scales vertically", () => {
    const newPresentation = resizePresentationStore(
      oldPresentation,
      {
        width: 1000,
        height: 1000,
      },
      400,
      800,
      { width: 600, height: 600 }
    )
    const frameAA = newPresentation.scenes.scenes.sceneA.frames.frameAA

    expect(newPresentation.meta.viewport.width).toEqual(1000)
    expect(newPresentation.meta.viewport.height).toEqual(1000)
    expect(frameAA.situation.width).toEqual(400)
    expect(frameAA.situation.height).toEqual(300)
    expect(frameAA.situation.left).toEqual(100)
    expect(frameAA.situation.top).toEqual(300)
  })

  it("scales in both directions", () => {
    const newPresentation = resizePresentationStore(
      oldPresentation,
      {
        width: 1800, // 1800:1000 = 1.8
        height: 1300, // 1300:600 = 2.17
      },
      720,
      800,
      { width: 600, height: 600 }
    )

    const frameAA = newPresentation.scenes.scenes.sceneA.frames.frameAA
    expect(newPresentation.meta.viewport.width).toEqual(1800)
    expect(newPresentation.meta.viewport.height).toEqual(1300)
    expect(frameAA.situation.width).toEqual(720)
    expect(frameAA.situation.height).toEqual(540)
    expect(frameAA.situation.left).toEqual(180)
    expect(frameAA.situation.top).toEqual(290)
  })

  it("scales down", () => {
    const newPresentation = resizePresentationStore(
      oldPresentation,
      {
        width: 800, // 800:1000 = 0.8
        height: 400, // 400:600 = 0.67
      },
      300,
      600,
      { width: 600, height: 600 }
    )
    const frameAA = newPresentation.scenes.scenes.sceneA.frames.frameAA
    expect(config.MINIMUM_FRAME_LONG_SIDE).toEqual(300)
    expect(newPresentation.meta.viewport.width).toEqual(800)
    expect(newPresentation.meta.viewport.height).toEqual(400)
    // This normally would be 268 but the MINIMUM_FRAME_LONG_SIDE os 300
    expect(frameAA.situation.width).toEqual(300)
    // ...and this side is calculated based on the long side
    expect(frameAA.situation.height).toEqual(225)
    // todo ?
    expect(frameAA.situation.left).toEqual(132)
    expect(frameAA.situation.top).toEqual(66)
  })
})
