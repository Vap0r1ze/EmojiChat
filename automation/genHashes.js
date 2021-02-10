const crypto = require('crypto')
const fs = require('fs')
const { join } = require('path')

const variants = [1, 2]
const qualities = ['HD', 'SD']
const zipFile = (variant, quality) => `EmojiChat.${variant}.${quality}.ResourcePack.zip`
const hashFile = variant => `hash.${variant}.txt`
const comment = variant => `# Resource Pack hashes for each EmojiPackVariant ${variant}`

for (const variant of variants) {
  const lines = [comment(variant)]
  for (const quality of qualities) {
    const packBytes = fs.readFileSync(join(__dirname, '../target', zipFile(variant, quality)))
    const hash = crypto.createHash('sha1')
    hash.update(packBytes)
    const hashBytes = hash.digest()
    const line = Array.from(hashBytes)
      .map(byte => (((byte + 128) % 256) - 128).toString()).join(',')
    lines.push(line)
  }
  const content = [...lines, ''].join('\n')
  fs.writeFileSync(join(__dirname, `../plugin/src/main/resources/${hashFile(variant)}`), content)
}
