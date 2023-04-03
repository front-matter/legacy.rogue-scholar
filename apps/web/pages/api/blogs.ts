import fs from 'fs'
import * as hcl from 'hcl2-parser'
import path from 'path'

export default (_req, res) => {
  const filePath = path.resolve('rogue-scholar.hcl')
  const hclString = fs.readFileSync(filePath)
  const json = hcl.parseToObject(hclString)[0].blog

  res.statusCode = 200
  res.json(json)
}
