// @ts-nocheck

import "./animation.css"

const html2canvas = require("html2canvas")

const REPETITION_COUNT = 8 // number of times each pixel is assigned to a canvas
const NUM_FRAMES = 16

/**
 * Generates the individual subsets of pixels that are animated to create the effect
 * @param {HTMLCanvasElement} ctx
 * @param {number} count The higher the frame count, the less grouped the pixels will look - Google use 32, but for our elms we use 128 since we have images near the edges
 * @return {HTMLCanvasElement[]} Each canvas contains a subset of the original pixels
 */
function generateFrames($canvas, count = 8) {
  const { width, height } = $canvas
  const ctx = $canvas.getContext("2d")
  const originalData = ctx.getImageData(0, 0, width, height)
  const imageDatas = [...Array(count)].map((_, i) =>
    ctx.createImageData(width, height)
  )

  // assign the pixels to a canvas
  // each pixel is assigned to 2 canvas', based on its x-position
  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      for (let i = 0; i < REPETITION_COUNT; ++i) {
        const dataIndex = Math.floor(
          (count * (Math.random() + (2 * x) / width)) / 3
        )
        const pixelIndex = (y * width + x) * 4
        // copy the pixel over from the original image
        for (let offset = 0; offset < 4; ++offset) {
          imageDatas[dataIndex].data[pixelIndex + offset] =
            originalData.data[pixelIndex + offset]
        }
      }
    }
  }

  // turn image datas into canvas'
  return imageDatas.map((data) => {
    const $c = $canvas.cloneNode(true)
    $c.getContext("2d").putImageData(data, 0, 0)
    return $c
  })
}

/**
 * Inserts a new element over an old one, hiding the old one
 */
function replaceElementVisually($old, $new) {
  const $parent = $old.offsetParent
  $new.style.top = `${$old.offsetTop}px`
  $new.style.left = `${$old.offsetLeft}px`
  $new.style.width = `${$old.offsetWidth}px`
  $new.style.height = `${$old.offsetHeight}px`
  $parent.appendChild($new)
  $old.style.visibility = "hidden"
}

/**
 * Disintegrates an element
 * @param {HTMLElement} $elm
 */
function disintegrate($elm) {
  return new Promise((resolve, reject) => {
    html2canvas($elm).then(($canvas) => {
      // create the container we'll use to replace the element with
      const $container = document.createElement("div")
      $container.classList.add("disintegration-container")

      // setup the frames for animation
      const $frames = generateFrames($canvas, NUM_FRAMES)
      $frames.forEach(($frame, i) => {
        // $frame.style.transitionDelay = `${i / $frames.length}s`;
        $container.appendChild($frame)
      })

      // then insert them into the DOM over the element
      replaceElementVisually($elm, $container)

      // then animate them
      $container &&
        $container.offsetLeft &&
        typeof $container.offsetLeft === "function" &&
        $container.offsetLeft()

      $frames.forEach(($frame) => {
        const randomRadian = 2 * Math.PI * (Math.random() - 0.5)
        $frame.style.transform = `rotate(${15 * (Math.random() - 0.5)}deg) 
                translate(${60 * Math.cos(randomRadian)}px, ${
          30 * Math.sin(randomRadian)
        }px)
                rotate(${15 * (Math.random() - 0.5)}deg)`
        $frame.style.opacity = 0
      })

      resolve()
    })
  })
}

export default disintegrate
