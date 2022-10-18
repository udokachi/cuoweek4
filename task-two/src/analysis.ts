/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
 import path from "path"
import fs from "fs"

 interface InputOutput {
  'valid-domains': string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  categories: { [k: string]: number };
}

let output: InputOutput = {
  "valid-domains": [],
  totalEmailsParsed: 0,
  totalValidEmails: 0,
  categories: {}
}

async function analyseFiles(inputPaths: string[], outputPath: string) {
  const inputFile = path.join(process.cwd(), ...inputPaths)
  const inputFileRead = fs.createReadStream(inputFile)

  for await (const chunkString of inputFileRead) {     
     
      const emailArr = chunkString.toString().split('\n')
     
      emailArr.forEach((el: string) => {
        
        if(el.includes('@')) {
          output.totalEmailsParsed++
        }
        
        if(el.split('@').slice(1)[0]?.includes('.')) {
          const domainHolder = el.split('@').slice(1)[0]

          output["valid-domains"].push(domainHolder)  
          output.totalValidEmails++

          if(output.categories[`${domainHolder}`]) {
            output.categories[`${domainHolder}`] +=1
            
          } else if(!output.categories[`${domainHolder}`]) {
            output.categories[`${domainHolder}`] = 1
            
          }
        }
        
      })
    }
  console.log('Complete the implementation in src/analysis.ts');
}

export default analyseFiles;
