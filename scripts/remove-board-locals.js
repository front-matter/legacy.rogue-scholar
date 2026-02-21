const fs = require("fs")
const path = require("path")

const localesDir = path.join(__dirname, "..", "public", "locales")
const keysToRemove = ["menu.board", "board.goal", "board.schedule"]

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const obj = JSON.parse(content)
    let changed = false
    keysToRemove.forEach((k) => {
      if (k in obj) {
        delete obj[k]
        changed = true
      }
    })
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n", "utf8")
      console.log("Updated", filePath)
    } else {
      console.log("No changes for", filePath)
    }
  } catch (err) {
    console.error("Failed to process", filePath, err.message)
  }
}

if (!fs.existsSync(localesDir)) {
  console.error("Locales directory not found:", localesDir)
  process.exit(1)
}

const locales = fs.readdirSync(localesDir)
locales.forEach((loc) => {
  const commonPath = path.join(localesDir, loc, "common.json")
  if (fs.existsSync(commonPath)) processFile(commonPath)
})

console.log("Done")
