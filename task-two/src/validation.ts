/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import path from 'path';
import fs, { ReadStream, WriteStream } from 'fs';
import dns from 'dns';

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
  const outputFileRead: WriteStream = fs.createWriteStream(outputFile, 'utf-8');
  const inputFileRead = fs.createReadStream(inputFile, 'utf-8');

  outputFileRead.write(`Emails\n`);
  let file = '';

  inputFileRead.on('data', (chunk) => {
    file = chunk.toString();
  });

  inputFileRead.on('end', () => {
    const emails = file.split('\n');
    for (const email of emails) {
      const domain = email.split('@')[1];
      if (domain) {
        dns.resolveMx(domain, (err, address) => {
          if (address && address.length > 0) {
            outputFileRead.write(`${email}\n`);
          }
        });
      }
    }
  });

  inputFileRead.on('err', (err) => {
    console.log(err);
  });
}

export default validateEmailAddresses;
