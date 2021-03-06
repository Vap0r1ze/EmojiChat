const fs = require('fs')
const { join } = require('path')
const sharp = require('sharp')
const emojiData = require('./emojis.json')

const twemojiPath = join(__dirname, '../twemoji/assets/svg')
const resourcesPath = join(__dirname, '../plugin/src/main/resources')
const packPath = join(__dirname, '../resourcepack/variant 2/sd')

function toCodePoint(unicodeSurrogates, sep) {
  var
    r = [],
    c = 0,
    p = 0,
    i = 0
  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++)
    if (p) {
      r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16))
      p = 0
    } else if (0xD800 <= c && c <= 0xDBFF) {
      p = c
    } else {
      r.push(c.toString(16))
    }
  }
  return r.join(sep || '-')
}
function getEmojiSvg(emoji) {
  let codePoint = toCodePoint(emoji)
  if (codePoint.split('-').length <= 3) {
    codePoint = codePoint.replace('-fe0f', '')
  }
  try {
    const buf = fs.readFileSync(join(twemojiPath, `${codePoint}.svg`))
    return buf
  } catch (error) {
    console.log('Could not find file for: codepoint %s, emoji %s', codePoint, emoji)
  }
}

async function main() {
  const emojiList = [
    '# EmojiChat emoji list generated by Vap0r1ze',
    '# This file is the list of emojis used to map to unicode characters, depending on the variant chosen in the config',
    '#',
    '# Lines prefixed with # are ignored'
  ]
  const emojiShortcuts = {}

  const pos = [0, 0]
  let page = 0x5a
  const sharpCreate = {
    width: 256,
    height: 256,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
  let img = sharp({ create: sharpCreate })
  let composites = []
  const categories = Object.keys(emojiData)
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    const emojis = emojiData[category]
    emojiList.push(`# ${category}`)
    for (let j = 0; j < emojis.length; j++) {
      const emoji = emojis[j]
      emojiList.push(`:${emoji.names[0]}:`)
      if (emoji.names.length > 1) {
        emojiShortcuts[emoji.names[0]] = emoji.names.slice(1)
      }

      const svg = getEmojiSvg(emoji.surrogates)
      composites.push({
        input: svg,
        top: pos[1] * 16,
        left: pos[0] * 16,
        density: 32
      })

      pos[0]++

      if (pos[0] >= 16) {
        pos[0] = 0
        pos[1]++
      }

      if (pos[1] >= 16 || (i === categories.length - 1 && j === emojis.length - 1)) {
        const buf = await img.composite(composites).png().toBuffer()
        console.log('writing page %s', page.toString(16), buf)
        fs.writeFileSync(join(packPath, 'assets/minecraft/textures/font', `unicode_page_${page.toString(16)}.png`), buf)
        pos[0] = 0
        pos[1] = 0
        page++
        composites = []
        img = sharp({ create: sharpCreate })
      }
    }
  }
  fs.writeFileSync(join(resourcesPath, 'list.txt'), emojiList.join('\n'))
}

main().catch(console.error)

// console.log(`${firstEmoji.names[0]}: ${twemojiBase}72x72/${firstEmoji.surrogates.codePointAt(0).toString(16)}.png`)
