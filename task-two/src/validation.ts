/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import path from 'path';
import fs, { ReadStream, WriteStream } from 'fs';
import childProcess from 'child_process';

interface InputOutput {
  'valid-domains': string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  categories: { [k: string]: number };
}

const output: InputOutput = {
  'valid-domains': [],
  totalEmailsParsed: 0,
  totalValidEmails: 0,
  categories: {},
};

async function validateEmailAddresses(inputPath: string[], outputFile: string) {
  const inputFile = path.join(process.cwd(), ...inputPath);
  const outputFileRead: WriteStream = fs.createWriteStream(outputFile);
  const inputFileRead = fs.createReadStream(inputFile);
  let count = 1;
  for await (const chunkString of inputFileRead) {
    const emailArr = chunkString.toString().split('\n');

    emailArr.forEach((el: string) => {
      const domainHolder = el.split('@').slice(1)[0];

      const child = childProcess
        .spawn('dig', ['MX', `${domainHolder}`, '+short', '+all'])
        .stdout.on('data', () => {
          if (child) {
            while (count > 1) {
              outputFileRead.write('Emails');
              count += 1;
            }
            outputFileRead.write(`${el}`);
          }
        });
    });
  }
}

export default validateEmailAddresses;
